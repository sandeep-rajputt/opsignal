"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Monitor, Smartphone, MapPin, Clock, AlertCircle } from "lucide-react";
import {
  useGetSessionsQuery,
  useRevokeSessionMutation,
} from "@/Store/api/getSessionsApi/getSessionsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import isApiError from "@/utils/isApiError";
import { Spinner } from "@/components/ui/spinner";

function UserSessionSetting() {
  const { data, isLoading, isError } = useGetSessionsQuery(null);
  const [revokeSession, { isLoading: isRevoking }] = useRevokeSessionMutation();

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId).unwrap();
      toast.success("Session revoked successfully");
    } catch (error) {
      const apiError = isApiError(error);
      toast.error(
        apiError?.message || "Failed to revoke session. Please try again.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Active Sessions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your active sessions across different devices
          </p>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-lg border"
              >
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load sessions. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Sessions</AlertTitle>
          <AlertDescription>
            You don&apos;t have any active sessions at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getDeviceIcon = (device: string | null) => {
    if (!device) return Monitor;
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes("iphone") || deviceLower.includes("android")) {
      return Smartphone;
    }
    return Monitor;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Active Sessions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your active sessions across different devices
        </p>

        <div className="space-y-4">
          {data.data.map((session, index) => {
            const DeviceIcon = getDeviceIcon(session.device);
            const isFirst = index === 0;

            return (
              <div key={session.id}>
                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                  <div className="p-2 rounded-lg bg-muted">
                    <DeviceIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">
                        {session.device || "Unknown Device"}
                      </h4>
                      {isFirst && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{session.location || "Unknown Location"}</span>
                        {session.ip_address && (
                          <span className="text-xs">
                            • {session.ip_address}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {new Date(session.updated_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!isFirst && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={isRevoking}
                    >
                      {isRevoking ? <Spinner /> : "Revoke"}
                    </Button>
                  )}
                </div>
                {index < data.data.length - 1 && <Separator className="my-4" />}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-lg border bg-muted/50">
          <p className="text-sm text-muted-foreground mb-3">
            If you notice any suspicious activity, revoke the session and change
            your password immediately.
          </p>
          <Button variant="outline" size="sm" disabled>
            Revoke All Other Sessions
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserSessionSetting;
