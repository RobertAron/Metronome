import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import React from "react";
import { cn } from "../other/cn";
import { rhythmOptions } from "../other/rhythmOptions";
import { useMetronomeContext } from "./MetronomeContext";
import groupBy from "lodash.groupby";
export const BeatSelect = () => {
  const { setBeats } = useMetronomeContext();
  return (
    <Select.Root
      onValueChange={(id) => {
        const option = rhythmOptions.find((ele) => ele.id === id);
        if (option === undefined) return;
        setBeats(option.metronomeBeats);
      }}
      defaultValue={rhythmOptions[0].id}
    >
      <Select.Trigger
        className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none gap-[5px] bg-white text-purple-950 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-purple-500 outline-none p-1"
        aria-label="Beat Options"
      >
        <Select.Value placeholder="Select a fruit…" />
        <Select.Icon className="text-purple-950">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
          <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-purple-600 cursor-default">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            {Object.entries(
              groupBy(rhythmOptions, (val) => val.id.split("-")[0])
            ).map(([group, values], index) => (
              <React.Fragment key={group}>
                {index !== 0 && (
                  <Select.Separator className="h-[1px] bg-purple-950 m-[5px]" />
                )}
                <Select.Group>
                  <Select.Label className="px-[25px] text-xs leading-[25px] text-purple-950">
                    {group}
                  </Select.Label>
                  {values.map((ele) => (
                    <SelectItem value={ele.id} key={ele.id}>
                      {ele.itemLabel}
                    </SelectItem>
                  ))}
                </Select.Group>
              </React.Fragment>
            ))}

            {/* <Select.Group>
              <Select.Label className="px-[25px] text-xs leading-[25px] text-purple-950">
                6/8
              </Select.Label>
              <SelectItem value="aubergine">Aubergine</SelectItem>
              <SelectItem value="broccoli">Broccoli</SelectItem>
              <SelectItem value="carrot" disabled>
                Carrot
              </SelectItem>
              <SelectItem value="courgette">Courgette</SelectItem>
              <SelectItem value="leek">Leek</SelectItem>
            </Select.Group> */}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-purple-950 cursor-default">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef(
  (
    {
      children,
      className,
      ...props
    }: Select.SelectItemProps & { value: string },
    forwardedRef: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <Select.Item
        className={cn(
          "text-[13px] leading-none text-purple-950 rounded-[3px] flex items-center pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-purple-950 data-[highlighted]:text-purple-950",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

export default BeatSelect;
