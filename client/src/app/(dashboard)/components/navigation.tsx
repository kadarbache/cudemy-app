"use client";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Home,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      {/* Main Section */}
      <div className="mb-6">
        <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Main
        </h3>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-foreground hover:bg-accent cursor-pointer"
          >
            <Home className="h-5 w-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </Button>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-between gap-3 text-foreground hover:bg-accent cursor-pointer"
              onClick={() => setStudentsOpen(!studentsOpen)}
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Students</span>
              </div>
              {studentsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Link href="/manage-courses">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-foreground hover:bg-accent cursor-pointer"
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Courses</span>
            </Button>
          </Link>

          <Link href="/manage-courses/reviews">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-foreground hover:bg-accent cursor-pointer"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium">Reviews</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-foreground hover:bg-accent cursor-pointer"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Schedules</span>
          </Button>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-between gap-3 text-foreground hover:bg-accent cursor-pointer"
              onClick={() => setIncomeOpen(!incomeOpen)}
            >
              <div className="flex items-center gap-3 cursor-pointer">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Income</span>
              </div>
              {incomeOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {incomeOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                >
                  Earnings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-foreground hover:bg-accent cursor-pointer"
                >
                  Refunds
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                >
                  Declines
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                >
                  Payouts
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div>
        <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer">
          Settings
        </h3>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-between gap-3 text-foreground hover:bg-accent cursor-pointer"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </div>
            {settingsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
