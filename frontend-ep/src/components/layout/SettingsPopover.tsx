import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import SettingsPopoverContent from "./SettingsPopoverContent";

const SettingsPopover = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      className="p-0 w-44 rounded-md shadow-md"
      sideOffset={8}
      align="end"
    >
      <SettingsPopoverContent />
    </PopoverContent>
  </Popover>
);

export default SettingsPopover;
