import { useColorMode } from "@kobalte/core"
import { Button } from "./ui/button"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Icon } from "./icons"

const themes = [
  { id: "light", name: "Light Mode", icon: "sun" },
  { id: "dark", name: "Dark Mode", icon: "moon" },
  { id: "system", name: "System Preference", icon: "gear" }
] as const

export function ModeToggle() {
  const { colorMode, setColorMode } = useColorMode()

  return (
    <div class="h-8 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-600 dark:to-zinc-900 rounded-lg p-px">
      <RadioGroup
        class="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 h-full rounded-[7px]"
        value={colorMode()}
        onChange={setColorMode as (value: string) => void}
        aria-label="Theme"
      >
        {themes.map(({ id, name, icon }) => (
          <RadioGroupItem
            class="p-px h-full [&[data-checked]]:bg-gradient-to-b [&[data-checked]]:from-zinc-300 [&[data-checked]]:to-zinc-400 dark:[&[data-checked]]:from-zinc-400 dark:[&[data-checked]]:to-zinc-600 rounded bg-transparent"
            value={id}
            aria-label={name}
          >
            <div
              class="h-full flex items-center justify-center text-black dark:text-white w-6 py-0.5 rounded-[3px]"
              classList={{
                "bg-zinc-200 dark:bg-zinc-700": colorMode() === id,
                "bg-transparent": colorMode() !== id
              }}
            >
              <Icon name={icon as Icon.Name} class="h-3.5" />
            </div>
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  )
}
