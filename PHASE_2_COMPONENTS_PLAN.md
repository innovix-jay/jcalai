# Phase 2: UI Components - Implementation Plan

## 🎨 Design System Overview

**Visual Language**: Vercel polish + Linear smoothness + ChatGPT conversational UI
**Animation Library**: Framer Motion
**Design Patterns**: Glassmorphism, gradient accents, micro-interactions

## 📦 Components to Build

### 1. Message Components (`components/builder/messages/`)
- `MessageBubble.tsx` - AI and User message bubbles with markdown
- `TypingIndicator.tsx` - Animated 3-dot loading state
- `SuggestedActions.tsx` - Clickable quick reply pills
- `MessageAvatar.tsx` - AI/User avatars with gradient backgrounds

### 2. AI Assistant Panel (`components/builder/AIAssistantPanel.tsx`)
- Glassmorphism panel with backdrop blur
- Auto-expand on new projects
- Smooth slide-in animation
- Message list with auto-scroll
- Rich input area with auto-resize
- Send button with loading state

### 3. Empty State (`components/builder/EmptyState.tsx`)
- Animated gradient background with floating orbs
- Welcoming heading with gradient text
- Robot waving animation
- Pulsing pointer to AI panel
- Quick start prompt cards

### 4. Plan Summary Card (`components/builder/PlanSummaryCard.tsx`)
- Gradient border card
- Expandable sections
- Feature checklist with checkmarks
- Tech stack badges
- Confirmation buttons with animations

### 5. Build Progress (`components/builder/BuildProgress.tsx`)
- Floating progress card
- Animated progress bar with shimmer
- Step-by-step indicators
- Confetti celebration on completion

### 6. Utility Components
- `LoadingSpinner.tsx` - Rotating gradient spinner
- `InfoCard.tsx` - Stat display cards
- `PageCard.tsx` - Page preview cards
- `Section.tsx` - Collapsible sections

## 🎭 Animation Patterns

### Entrance Animations
```typescript
// Panel slide-in
initial={{ x: 480, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
transition={{ type: "spring", damping: 25, stiffness: 200 }}

// Fade + Scale
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.3 }}

// Slide up
initial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
```

### Micro-interactions
```typescript
// Hover scale
whileHover={{ scale: 1.05 }}

// Tap feedback
whileTap={{ scale: 0.98 }}

// Pulsing animation
animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
transition={{ duration: 2, repeat: Infinity }}
```

### Stagger Animations
```typescript
variants={{
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}}
```

## 🎨 Design Tokens

### Colors
```typescript
const colors = {
  ai: {
    gradient: "from-indigo-500 to-purple-600",
    bg: "bg-gradient-to-r from-indigo-500 to-purple-600",
    text: "text-indigo-600"
  },
  user: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-900 dark:text-white"
  },
  glass: {
    bg: "bg-white/80 dark:bg-gray-900/80",
    blur: "backdrop-blur-xl",
    border: "border-gray-200/50"
  }
}
```

### Typography
```typescript
const typography = {
  heading: "text-4xl font-bold",
  subheading: "text-xl text-gray-600",
  body: "text-base text-gray-700",
  small: "text-sm text-gray-600"
}
```

### Spacing
```typescript
const spacing = {
  panel: "w-[480px]",
  card: "p-6 rounded-2xl",
  section: "space-y-4",
  gap: "gap-4"
}
```

## 📱 Responsive Breakpoints

```typescript
// Desktop: Full panel (480px)
// Tablet: Overlay (full width)
// Mobile: Bottom sheet
```

## ♿ Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators
- Screen reader announcements
- Reduced motion respect

## 🔌 Integration Flow

```
BuilderPage
  ├─ useEffect: Detect new project
  ├─ Call: projectOnboardingService.initiateProject()
  ├─ Auto-expand: AIAssistantPanel
  │   ├─ Display: Greeting message
  │   ├─ Show: SuggestedActions
  │   └─ Handle: User input
  ├─ Show: EmptyState (if no pages)
  ├─ Show: PlanSummaryCard (on CONFIRMING_PLAN stage)
  └─ Show: BuildProgress (on BUILDING stage)
```

## 📊 Component State Management

```typescript
// Builder Page State
{
  isNewProject: boolean
  showAssistant: boolean
  onboardingContext: ConversationContext | null
  buildProgress: number
  buildSteps: BuildStep[]
}

// AI Assistant Panel State
{
  messages: ConversationMessage[]
  isTyping: boolean
  userInput: string
  isProcessing: boolean
}
```

## 🎯 Performance Optimizations

- Lazy load heavy components
- Virtualize long message lists
- Debounce input changes
- Memoize expensive renders
- Code split Framer Motion animations

## ✨ Polish Details

### Message Bubbles
- Markdown rendering with syntax highlighting
- Code blocks with copy button
- Link previews
- Emoji support
- Timestamps

### Typing Indicator
- 3 bouncing dots
- Staggered animation
- Appears/disappears smoothly

### Suggested Actions
- Pill-shaped buttons
- Hover scale effect
- Click sends message
- Disappear after use

### Empty State
- Gradient background animation
- Floating orbs with slow motion
- Robot animation (Lottie or SVG)
- Pulsing pointer

### Plan Card
- Gradient borders
- Expandable sections
- Edit mode
- Smooth transitions

### Progress Bar
- Gradient fill
- Shimmer effect
- Smooth percentage updates
- Celebratory animation

## 🚀 Implementation Priority

**P0 - Must Have**:
1. AIAssistantPanel with messages
2. MessageBubble components
3. TypingIndicator
4. EmptyState
5. Builder page integration

**P1 - Should Have**:
6. PlanSummaryCard
7. SuggestedActions
8. BuildProgress
9. Confetti celebration

**P2 - Nice to Have**:
10. Advanced animations
11. Sound effects
12. Keyboard shortcuts
13. Mobile optimization

## 📝 Testing Checklist

- [ ] Panel opens/closes smoothly
- [ ] Messages appear with animation
- [ ] Markdown renders correctly
- [ ] Suggested actions work
- [ ] Empty state displays
- [ ] Plan card shows/hides
- [ ] Progress updates real-time
- [ ] Responsive on all sizes
- [ ] Keyboard navigation works
- [ ] Dark mode looks good
- [ ] No performance issues
- [ ] Accessible with screen reader

---

**Status**: Dependencies installed ✓
**Next**: Build core components

