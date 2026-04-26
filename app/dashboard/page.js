"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser, clearAuthCookie } from "@/lib/auth";
import { getCurrentStudyDay, isDormantPeriod, isNewDayAvailable } from "@/lib/ist";
import { STUDY_CONFIG } from "@/study.config";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar from "@/components/ui/ProgressBar";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionAvailable, setSessionAvailable] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/");
          return;
        }
        if (currentUser.is_disqualified) {
          setMessage(
            "Your participation has been discontinued due to inactivity.",
          );
          setUser(currentUser);
          setLoading(false);
          return;
        }
        setUser(currentUser);

        const now = new Date();
        const studyStart = new Date(STUDY_CONFIG.studyStartDate);
        const isAfterStart = now >= studyStart;
        const currentStudyDay = getCurrentStudyDay(STUDY_CONFIG.studyStartDate, now);
        const isDormant = isDormantPeriod(now);
        const sessionsCompleted = (currentUser.day_progress || 1) - 1;
        const hasDoneToday = currentUser.last_completed_session_timestamp
          ? !isNewDayAvailable(currentUser.last_completed_session_timestamp, now)
          : false;
        
        const canStart =
          isAfterStart &&
          !isDormant &&
          !hasDoneToday &&
          sessionsCompleted < STUDY_CONFIG.totalDays &&
          sessionsCompleted < currentStudyDay &&
          currentUser.has_onboarded;

        setSessionAvailable(canStart);

        if (!canStart && isAfterStart) {
          if (isDormant) {
            setMessage("Study is currently dormant. Next session unlocks at 6:00 AM IST.");
          } else if (sessionsCompleted >= STUDY_CONFIG.totalDays) {
            setMessage("All sessions completed! Thank you for your participation.");
          } else if (hasDoneToday) {
            setMessage(`Session ${sessionsCompleted} done. Next session unlocks tomorrow at 6:00 AM IST.`);
          } else if (sessionsCompleted >= currentStudyDay) {
            setMessage(`${sessionsCompleted} ${sessionsCompleted === 1 ? 'session' : 'sessions'} done. Next session unlocks tomorrow at 6:00 AM IST.`);
          } else if (!currentUser.has_onboarded) {
            setMessage("Please complete the pre-study survey to begin your first session.");
          }
        } else if (!canStart && !isAfterStart) {
          const startDate = studyStart.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          });
          const startTime = studyStart.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short'
          });
          setMessage(`Study begins ${startDate} at ${startTime}.`);
        }
      } catch {
        setMessage("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await clearAuthCookie();
    router.push("/");
  };

  if (loading) {
    return <LoadingScreen isVisible={true} />;
  }

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 text-center">
        <GlassCard className="max-w-md">
          <h2 className="font-mono text-xl mb-4 text-red-500">Access Restricted</h2>
          <p className="font-mono text-sm text-foreground/60 mb-6">
            {message || "We could not verify your session. Please log in again."}
          </p>
          <button
            onClick={handleLogout}
            className="bg-foreground text-background font-mono px-6 py-2 rounded-lg hover:bg-foreground/90 transition"
          >
            Go to Login
          </button>
        </GlassCard>
      </div>
    );
  }

  const sessionsCompleted = (user.day_progress || 1) - 1;
  const groupIcons = {
    A: "https://assets.imace.online/image/samaralogo.svg",
    B: "https://assets.imace.online/image/arterylogo.svg",
    C: "https://assets.imace.online/image/psysynapicon.svg",
  };
  const groupNames = {
    A: "Relational AI: Samara",
    B: "Functional AI: Artery",
    C: "Self Reflection",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-mono text-3xl">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm font-mono text-foreground/60 hover:text-foreground"
        >
          Logout
        </button>
      </div>

      <GlassCard className="mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-foreground/60">Participant</p>
            <h2 className="font-body text-xl">{user.name || "Participant"}</h2>
            <p className="font-mono text-sm text-foreground/60 mt-1">
              ID: {user.participant_id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src={groupIcons[user.study_group] || groupIcons.C}
              alt="Group"
              width={160}
              height={90}
            />
            <span className="font-mono text-sm bg-muted px-3 py-1 rounded-full">
              {groupNames[user.study_group] || `Group ${user.study_group}`}
            </span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mb-6">
        <ProgressBar value={sessionsCompleted} max={STUDY_CONFIG.totalDays} />
        <p className="font-mono text-xs text-foreground/60 mt-3">
          New sessions unlock daily at 6:00 AM IST
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pre‑Survey Card */}
        <GlassCard>
          <h3 className="font-mono text-lg mb-2">Pre‑Study Survey</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Mind & Experience baseline
          </p>
          {user.has_onboarded ? (
            <span className="text-accent font-mono text-sm">✓ Completed</span>
          ) : (
            <Link
              href="/pre-survey"
              className="block w-full text-center bg-foreground text-background font-mono py-2 rounded-lg hover:bg-foreground/90"
            >
              Start
            </Link>
          )}
        </GlassCard>

        {/* Daily Session Card */}
        <GlassCard>
          <h3 className="font-mono text-lg mb-2">Daily Session</h3>
          <p className="text-sm text-foreground/60 mb-4">
            {sessionsCompleted} of {STUDY_CONFIG.totalDays} completed
          </p>
          {!user.has_onboarded ? (
            <span className="text-yellow-400 font-mono text-sm">
              Complete pre‑survey first
            </span>
          ) : sessionsCompleted >= STUDY_CONFIG.totalDays ? (
            <span className="text-accent font-mono text-sm">
              ✓ All sessions done
            </span>
          ) : sessionAvailable ? (
            <Link
              href="/session"
              className="block w-full text-center bg-accent text-background font-mono py-2 rounded-lg hover:bg-accent/80 shadow-[0_0_15px_#4ade80]"
            >
              Start Today's Session
            </Link>
          ) : (
            <span className="text-foreground/40 font-mono text-sm text-center block">
              {message}
            </span>
          )}
        </GlassCard>

        {/* Post‑Survey Card */}
        <GlassCard>
          <h3 className="font-mono text-lg mb-2">Post‑Study Survey</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Final assessment + Godspeed
          </p>
          {sessionsCompleted < STUDY_CONFIG.totalDays ? (
            <span className="text-foreground/40 font-mono text-sm">
              Complete all sessions first
            </span>
          ) : user.post_study_mind_experience ? (
            <span className="text-accent font-mono text-sm">✓ Completed</span>
          ) : (
            <Link
              href="/post-survey"
              className="block w-full text-center bg-foreground text-background font-mono py-2 rounded-lg hover:bg-foreground/90"
            >
              Start
            </Link>
          )}
        </GlassCard>
      </div>

      {sessionsCompleted >= STUDY_CONFIG.totalDays &&
        user.post_study_mind_experience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-6 border border-accent/30 rounded-2xl bg-accent/5 text-center"
          >
            <p className="font-body">
              Thank you for completing the study!
              <br />
              <span className="text-sm text-foreground/60">
                Email research@imace.online with your participant ID (
                {user.participant_id}) for a certificate.
              </span>
            </p>
          </motion.div>
        )}
    </div>
  );
}
