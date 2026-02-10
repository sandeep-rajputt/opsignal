"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/Store/hooks";
import { useAppDispatch } from "@/Store/hooks";
import { hideSetting } from "@/Store/slice/dialogsSlice";
import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, MonitorSmartphone } from "lucide-react";
import UserProfileSetting from "./UserProfileSetting";
import UserSecuritySetting from "./UserSecuritySetting";
import UserSessionSetting from "./UserSessionSetting";
import { Separator } from "@/components/ui/separator";

function UserSettingDialog() {
  const dispatch = useAppDispatch();
  const { visible, component } = useAppSelector(
    (state) => state.dialogs.setting,
  );
  const [_setting, setSetting] = useQueryState("setting");

  return (
    <Dialog
      open={visible}
      onOpenChange={() => {
        setSetting(null);
        dispatch(hideSetting());
      }}
    >
      <DialogContent
        className="max-w-3xl! mx-auto w-[calc(100vw-40px)] overflow-y-hidden max-h-[600px] h-[80vh] p-0 gap-0! flex flex-col"
        showCloseButton={true}
      >
        <DialogHeader className="px-6 py-4 h-fit">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Separator />
        <Tabs
          defaultValue={component!}
          onValueChange={(value) => {
            setSetting(value);
          }}
          className="flex h-full overflow-y-hidden flex-col sm:flex-row"
          orientation="vertical"
        >
          <TabsList className="flex flex-col sm:flex-row h-full w-56 rounded-none bg-transparent p-2 justify-start">
            <TabsTrigger
              value="profile"
              className="w-full justify-start gap-2 px-3"
            >
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="w-full justify-start gap-2 px-3"
            >
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="w-full justify-start gap-2 px-3"
            >
              <MonitorSmartphone className="h-4 w-4" />
              Sessions
            </TabsTrigger>
          </TabsList>
          <Separator orientation="vertical" className="sm:block hidden" />
          <Separator orientation="horizontal" className="sm:hidden block" />
          <div className="flex-1 overflow-y-auto h-full">
            <TabsContent value="profile" className="m-0 h-full">
              <UserProfileSetting />
            </TabsContent>
            <TabsContent value="security" className="m-0 h-full">
              <UserSecuritySetting />
            </TabsContent>
            <TabsContent value="sessions" className="m-0 h-full">
              <UserSessionSetting />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default UserSettingDialog;
