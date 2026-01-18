// Exercise database with descriptions and video tutorials
export interface ExerciseInfo {
  name: string;
  description: string;
  muscles: string[];
  videoUrl: string; // YouTube embed URL
  tips: string[];
}

// Normalized name lookup (lowercase, no spaces/hyphens)
function normalizeExerciseName(name: string): string {
  return name.toLowerCase().replace(/[-\s]/g, '').replace(/[^a-z0-9]/g, '');
}

const exerciseData: ExerciseInfo[] = [
  // CHEST
  {
    name: "Bench Press",
    description: "The bench press is a compound exercise that primarily targets the chest muscles (pectorals), with secondary emphasis on the shoulders (deltoids) and triceps. Lie on a flat bench, grip the barbell slightly wider than shoulder-width, lower it to your chest, and press back up.",
    muscles: ["Chest", "Shoulders", "Triceps"],
    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
    tips: ["Keep your feet flat on the floor", "Maintain a slight arch in your lower back", "Lower the bar to mid-chest level", "Keep your elbows at about 45 degrees"]
  },
  {
    name: "Incline Bench Press",
    description: "The incline bench press targets the upper portion of the chest (clavicular head of pectoralis major) along with the front deltoids. Set the bench to 30-45 degrees and press the barbell from your upper chest.",
    muscles: ["Upper Chest", "Shoulders", "Triceps"],
    videoUrl: "https://www.youtube.com/embed/SrqOu55lrYU",
    tips: ["Set incline to 30-45 degrees", "Keep shoulders pulled back", "Touch bar to upper chest", "Don't flare elbows excessively"]
  },
  {
    name: "Dumbbell Chest Press",
    description: "The dumbbell chest press allows for a greater range of motion than the barbell version and helps address muscle imbalances. Lie on a flat bench with dumbbells at chest level and press them up while bringing them slightly together at the top.",
    muscles: ["Chest", "Shoulders", "Triceps"],
    videoUrl: "https://www.youtube.com/embed/VmB1G1K7v94",
    tips: ["Start with dumbbells at chest level", "Press up and slightly inward", "Lower with control", "Keep wrists neutral"]
  },
  {
    name: "Push-ups",
    description: "Push-ups are a fundamental bodyweight exercise that builds chest, shoulder, and tricep strength. Start in a plank position, lower your body until your chest nearly touches the floor, then push back up.",
    muscles: ["Chest", "Shoulders", "Triceps", "Core"],
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    tips: ["Keep your body in a straight line", "Hands slightly wider than shoulders", "Lower until chest is near floor", "Engage your core throughout"]
  },
  {
    name: "Chest Flyes",
    description: "Chest flyes isolate the pectoral muscles by eliminating tricep involvement. Lie on a bench with dumbbells extended above your chest, then lower them out to the sides in an arc motion before squeezing them back together.",
    muscles: ["Chest"],
    videoUrl: "https://www.youtube.com/embed/eozdVDA78K0",
    tips: ["Keep a slight bend in elbows", "Lower until you feel a stretch", "Squeeze chest at the top", "Control the weight throughout"]
  },
  {
    name: "Cable Crossover",
    description: "Cable crossovers provide constant tension on the chest muscles throughout the movement. Stand between cable stations, grab the handles, and bring your hands together in front of your body in a hugging motion.",
    muscles: ["Chest", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/taI4XduLpTk",
    tips: ["Lean slightly forward", "Keep elbows slightly bent", "Squeeze at the bottom", "Control the negative"]
  },
  {
    name: "Dips",
    description: "Dips are a compound exercise targeting the chest, triceps, and shoulders. Grip parallel bars, lower your body by bending your elbows, and push back up. Leaning forward emphasizes the chest.",
    muscles: ["Chest", "Triceps", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/2z8JmcrW-As",
    tips: ["Lean forward for more chest", "Lower until upper arms are parallel", "Keep elbows close to body for triceps", "Don't lock out aggressively"]
  },
  {
    name: "Decline Bench Press",
    description: "The decline bench press targets the lower chest. Set the bench to a 15-30 degree decline and press the barbell from your lower chest.",
    muscles: ["Lower Chest", "Triceps", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/LfyQBUKR8SE",
    tips: ["Secure feet under pads", "Lower to lower chest", "Keep back flat on bench", "Don't go too steep on decline"]
  },
  {
    name: "Incline Dumbbell Press",
    description: "The incline dumbbell press targets the upper chest with greater range of motion than barbell. Set bench to 30-45 degrees and press dumbbells up and together.",
    muscles: ["Upper Chest", "Shoulders", "Triceps"],
    videoUrl: "https://www.youtube.com/embed/8iPEnn-ltC8",
    tips: ["Set incline to 30-45 degrees", "Lower dumbbells to sides of chest", "Press up and slightly inward", "Keep wrists neutral"]
  },
  {
    name: "Decline Dumbbell Press",
    description: "The decline dumbbell press emphasizes the lower chest. Lie on a decline bench and press dumbbells from the sides of your lower chest.",
    muscles: ["Lower Chest", "Triceps", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/0PHxvgQQMGs",
    tips: ["Secure feet under pads", "Lower to sides of lower chest", "Press up and together", "Control the descent"]
  },
  {
    name: "Incline Flyes",
    description: "Incline flyes isolate the upper chest. Set bench to 30-45 degrees, lower dumbbells in an arc to the sides, then squeeze them back together.",
    muscles: ["Upper Chest"],
    videoUrl: "https://www.youtube.com/embed/ajdFwa-qM98",
    tips: ["Keep slight bend in elbows", "Feel the stretch at bottom", "Squeeze chest at top", "Don't go too heavy"]
  },
  {
    name: "Decline Flyes",
    description: "Decline flyes target the lower chest. Lie on a decline bench and perform the fly movement with dumbbells.",
    muscles: ["Lower Chest"],
    videoUrl: "https://www.youtube.com/embed/N-xCvhP-X4c",
    tips: ["Secure feet under pads", "Keep elbows slightly bent", "Lower until stretch is felt", "Squeeze lower chest at top"]
  },
  {
    name: "Low Cable Crossover",
    description: "Low cable crossovers target the upper chest. Set cables at the lowest position and bring hands up and together in front of you.",
    muscles: ["Upper Chest", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/GxoVmkHS3-k",
    tips: ["Set pulleys at bottom", "Bring hands up and together", "Squeeze upper chest at top", "Control the descent"]
  },
  {
    name: "High Cable Crossover",
    description: "High cable crossovers emphasize the lower chest. Set cables at the highest position and bring hands down and together in front of your hips.",
    muscles: ["Lower Chest"],
    videoUrl: "https://www.youtube.com/embed/taI4XduLpTk",
    tips: ["Set pulleys at top", "Bring hands down and together", "Squeeze at bottom", "Keep slight forward lean"]
  },

  // BACK
  {
    name: "Deadlift",
    description: "The deadlift is a fundamental compound movement that works the entire posterior chain. Stand with feet hip-width apart, grip the bar, keep your back straight, and lift by driving through your heels and extending your hips.",
    muscles: ["Lower Back", "Glutes", "Hamstrings", "Traps", "Forearms"],
    videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q",
    tips: ["Keep the bar close to your body", "Drive through your heels", "Keep your back flat, not rounded", "Lock out at the top by squeezing glutes"]
  },
  {
    name: "Pull-ups",
    description: "Pull-ups are a challenging bodyweight exercise that builds back width and bicep strength. Hang from a bar with palms facing away, pull yourself up until your chin is over the bar, then lower with control.",
    muscles: ["Lats", "Biceps", "Rear Deltoids", "Core"],
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
    tips: ["Start from a dead hang", "Pull elbows down and back", "Chin over the bar at top", "Lower with control, full extension"]
  },
  {
    name: "Lat Pulldown",
    description: "The lat pulldown is a machine exercise that mimics the pull-up motion and builds back width. Sit at the machine, grip the bar wide, and pull it down to your upper chest while squeezing your lats.",
    muscles: ["Lats", "Biceps", "Rear Deltoids"],
    videoUrl: "https://www.youtube.com/embed/CAwf7n6Luuc",
    tips: ["Lean back slightly", "Pull to upper chest", "Squeeze shoulder blades together", "Control the weight back up"]
  },
  {
    name: "Barbell Row",
    description: "Barbell rows build back thickness and strength. Bend at the hips, keep your back flat, and pull the barbell to your lower chest/upper abdomen while squeezing your shoulder blades together.",
    muscles: ["Lats", "Rhomboids", "Rear Deltoids", "Biceps"],
    videoUrl: "https://www.youtube.com/embed/FWJR5Ve8bnQ",
    tips: ["Keep back flat, core tight", "Pull to lower chest/upper abs", "Squeeze at the top", "Control the negative"]
  },
  {
    name: "Seated Cable Row",
    description: "The seated cable row is an excellent exercise for building back thickness. Sit at the machine with your feet on the platform, grab the handle, and pull it to your midsection while keeping your back straight.",
    muscles: ["Lats", "Rhomboids", "Biceps", "Lower Back"],
    videoUrl: "https://www.youtube.com/embed/GZbfZ033f74",
    tips: ["Sit up tall, slight lean back at contraction", "Pull to your belly button", "Squeeze shoulder blades", "Don't swing your torso"]
  },
  {
    name: "Dumbbell Row",
    description: "Dumbbell rows are a unilateral exercise that helps address muscle imbalances. Place one knee and hand on a bench, hold a dumbbell in the other hand, and row it up to your hip.",
    muscles: ["Lats", "Rhomboids", "Biceps", "Rear Deltoids"],
    videoUrl: "https://www.youtube.com/embed/pYcpY20QaE8",
    tips: ["Keep your back flat", "Pull elbow up and back", "Squeeze at the top", "Don't rotate your torso"]
  },
  {
    name: "T-Bar Row",
    description: "T-bar rows target the middle back and allow you to use heavy weight safely. Straddle the bar, bend at the hips, grip the handles, and row the weight to your chest.",
    muscles: ["Lats", "Rhomboids", "Rear Deltoids", "Biceps"],
    videoUrl: "https://www.youtube.com/embed/j3Igk5nyZE4",
    tips: ["Keep chest up, back flat", "Pull to your lower chest", "Squeeze shoulder blades", "Don't jerk the weight"]
  },
  {
    name: "Face Pulls",
    description: "Face pulls target the rear deltoids and upper back muscles, helping improve posture and shoulder health. Pull the rope attachment toward your face while keeping your elbows high.",
    muscles: ["Rear Deltoids", "Rhomboids", "Rotator Cuff"],
    videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk",
    tips: ["Keep elbows high", "Pull to face level", "Externally rotate at end", "Focus on rear delts, not biceps"]
  },
  {
    name: "Chin-ups",
    description: "Chin-ups use an underhand grip which emphasizes the biceps more than pull-ups. Hang from a bar with palms facing you and pull until chin clears the bar.",
    muscles: ["Lats", "Biceps", "Core"],
    videoUrl: "https://www.youtube.com/embed/brhRXlOhsAM",
    tips: ["Palms face toward you", "Pull elbows down", "Chin over bar at top", "Great for bicep development"]
  },
  {
    name: "Wide Grip Pull-ups",
    description: "Wide grip pull-ups emphasize lat width. Use a grip wider than shoulder width with palms facing away.",
    muscles: ["Lats", "Teres Major", "Biceps"],
    videoUrl: "https://www.youtube.com/embed/cyGfOvkNZec",
    tips: ["Grip wider than shoulders", "Pull elbows down and out", "Focus on lat contraction", "Don't swing"]
  },
  {
    name: "Close Grip Lat Pulldown",
    description: "Close grip lat pulldown uses a narrow handle to target the lats with greater range of motion and bicep involvement.",
    muscles: ["Lats", "Biceps", "Rhomboids"],
    videoUrl: "https://www.youtube.com/embed/lLCMU4pHkW4",
    tips: ["Use V-bar or close grip handle", "Pull to upper chest", "Squeeze lats at bottom", "Control the return"]
  },
  {
    name: "Wide Grip Lat Pulldown",
    description: "Wide grip lat pulldown emphasizes lat width. Grip the bar wider than shoulder width and pull to upper chest.",
    muscles: ["Lats", "Teres Major", "Biceps"],
    videoUrl: "https://www.youtube.com/embed/JEb-dwU3VF4",
    tips: ["Grip wider than shoulders", "Lean back slightly", "Pull to upper chest", "Focus on lat spread"]
  },
  {
    name: "Sumo Deadlift",
    description: "Sumo deadlift uses a wide stance which emphasizes the inner thighs and reduces lower back stress. Stand with feet wide and grip the bar between your legs.",
    muscles: ["Glutes", "Inner Thighs", "Hamstrings", "Lower Back"],
    videoUrl: "https://www.youtube.com/embed/tfYGqRQ8h74",
    tips: ["Wide stance, toes pointed out", "Grip between legs", "Push knees out", "Keep chest up"]
  },
  {
    name: "Stiff Leg Deadlift",
    description: "Stiff leg deadlift keeps legs nearly straight to maximize hamstring stretch and activation. Push hips back while lowering the weight.",
    muscles: ["Hamstrings", "Glutes", "Lower Back"],
    videoUrl: "https://www.youtube.com/embed/1uDiW5--rAE",
    tips: ["Keep legs almost straight", "Push hips back", "Feel hamstring stretch", "Don't round lower back"]
  },
  {
    name: "Deficit Deadlift",
    description: "Deficit deadlifts are performed standing on a raised platform to increase range of motion and difficulty.",
    muscles: ["Lower Back", "Glutes", "Hamstrings", "Quads"],
    videoUrl: "https://www.youtube.com/embed/vpb8-c_QKFQ",
    tips: ["Stand on 2-4 inch platform", "Maintain proper form", "Great for building strength off floor", "Start lighter than regular deadlift"]
  },
  {
    name: "Single Arm Dumbbell Row",
    description: "Single arm dumbbell row allows focus on each side independently, helping fix muscle imbalances. Support yourself on a bench and row the dumbbell to your hip.",
    muscles: ["Lats", "Rhomboids", "Biceps"],
    videoUrl: "https://www.youtube.com/embed/pYcpY20QaE8",
    tips: ["One knee and hand on bench", "Row to hip, not chest", "Squeeze shoulder blade", "Don't rotate torso"]
  },
  {
    name: "Pendlay Row",
    description: "Pendlay rows start from a dead stop on the floor each rep, building explosive pulling power. Keep back parallel to floor and row explosively.",
    muscles: ["Lats", "Rhomboids", "Lower Back"],
    videoUrl: "https://www.youtube.com/embed/T3N-TO4reLQ",
    tips: ["Bar starts on floor each rep", "Back parallel to ground", "Pull explosively to chest", "Reset between reps"]
  },
  {
    name: "Meadows Row",
    description: "Meadows row is a landmine row variation that targets the lats from a unique angle. Stand perpendicular to the bar and row with an overhand grip.",
    muscles: ["Lats", "Rear Deltoids", "Biceps"],
    videoUrl: "https://www.youtube.com/embed/mR0VpZLbsY0",
    tips: ["Stand perpendicular to bar", "Overhand grip on bar end", "Row to hip", "Great lat stretch at bottom"]
  },
  {
    name: "Chest Supported Row",
    description: "Chest supported row eliminates lower back strain by supporting your chest on an incline bench while rowing dumbbells or a barbell.",
    muscles: ["Lats", "Rhomboids", "Rear Deltoids"],
    videoUrl: "https://www.youtube.com/embed/H75im9fAUMc",
    tips: ["Lie face down on incline bench", "Let arms hang straight down", "Row to hips", "Squeeze shoulder blades"]
  },

  // SHOULDERS
  {
    name: "Overhead Press",
    description: "The overhead press is a fundamental compound movement for building shoulder strength and size. Stand with feet shoulder-width, press the barbell from your shoulders straight overhead until arms are fully extended.",
    muscles: ["Shoulders", "Triceps", "Upper Chest"],
    videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI",
    tips: ["Brace your core", "Press straight up, head through at top", "Full lockout overhead", "Don't lean back excessively"]
  },
  {
    name: "Shoulder Press",
    description: "The shoulder press can be done seated or standing with dumbbells or a barbell. It primarily targets all three heads of the deltoid muscle. Press the weight from shoulder level to overhead.",
    muscles: ["Shoulders", "Triceps"],
    videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog",
    tips: ["Keep core tight", "Press in a slight arc", "Don't lock out aggressively", "Control the descent"]
  },
  {
    name: "Lateral Raises",
    description: "Lateral raises isolate the side (lateral) deltoids, creating wider-looking shoulders. Hold dumbbells at your sides and raise them out to the sides until arms are parallel to the floor.",
    muscles: ["Side Deltoids"],
    videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo",
    tips: ["Slight bend in elbows", "Lead with your elbows", "Raise to shoulder height", "Control the negative"]
  },
  {
    name: "Front Raises",
    description: "Front raises target the front (anterior) deltoids. Hold dumbbells in front of your thighs and raise them straight in front of you to shoulder height.",
    muscles: ["Front Deltoids"],
    videoUrl: "https://www.youtube.com/embed/-t7fuZ0KhDA",
    tips: ["Keep arms nearly straight", "Raise to shoulder level", "Don't swing the weight", "Alternate arms or do together"]
  },
  {
    name: "Reverse Flyes",
    description: "Reverse flyes target the rear deltoids and upper back. Bend at the hips, hold dumbbells with palms facing each other, and raise them out to the sides.",
    muscles: ["Rear Deltoids", "Rhomboids"],
    videoUrl: "https://www.youtube.com/embed/oLrBaVNVdkE",
    tips: ["Bend forward at hips", "Keep slight bend in elbows", "Squeeze shoulder blades", "Don't use momentum"]
  },
  {
    name: "Arnold Press",
    description: "The Arnold Press, named after Arnold Schwarzenegger, is a shoulder press variation that works all three deltoid heads through a rotational movement.",
    muscles: ["Shoulders", "Triceps"],
    videoUrl: "https://www.youtube.com/embed/6Z15_WdXmVw",
    tips: ["Start with palms facing you", "Rotate as you press up", "End with palms forward", "Control the rotation back down"]
  },
  {
    name: "Upright Row",
    description: "Upright rows target the side deltoids and traps. Hold a barbell or dumbbells in front of your thighs and pull straight up to chin level, keeping elbows high.",
    muscles: ["Side Deltoids", "Traps"],
    videoUrl: "https://www.youtube.com/embed/amCU-ziHITM",
    tips: ["Use wide grip for shoulders", "Keep bar close to body", "Lead with elbows", "Don't go too heavy"]
  },
  {
    name: "Shrugs",
    description: "Shrugs isolate the trapezius muscles. Hold heavy dumbbells or a barbell at your sides and shrug your shoulders up toward your ears.",
    muscles: ["Traps"],
    videoUrl: "https://www.youtube.com/embed/cJRVVxmytaM",
    tips: ["Shrug straight up, not forward", "Hold at the top briefly", "Control the descent", "Don't roll your shoulders"]
  },
  {
    name: "Dumbbell Shoulder Press",
    description: "Dumbbell shoulder press allows for natural arm path and addresses muscle imbalances. Press dumbbells from shoulder level to overhead.",
    muscles: ["Shoulders", "Triceps"],
    videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog",
    tips: ["Start at shoulder level", "Press up and slightly inward", "Don't bang dumbbells together", "Control the descent"]
  },
  {
    name: "Seated Dumbbell Shoulder Press",
    description: "Seated dumbbell press provides back support for stricter form. Sit with back against pad and press dumbbells overhead.",
    muscles: ["Shoulders", "Triceps"],
    videoUrl: "https://www.youtube.com/embed/B-aVuyhvLHU",
    tips: ["Back flat against pad", "Press to full extension", "Keep core tight", "Lower to ear level"]
  },
  {
    name: "Military Press",
    description: "Standing military press is a strict overhead press with feet together. Press the barbell from shoulders to overhead without leg drive.",
    muscles: ["Shoulders", "Triceps", "Core"],
    videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI",
    tips: ["Feet together or close", "No leg drive", "Brace core tight", "Press straight up"]
  },
  {
    name: "Push Press",
    description: "Push press uses leg drive to help press heavier weight overhead. Dip at the knees and explosively extend to help drive the bar up.",
    muscles: ["Shoulders", "Triceps", "Legs"],
    videoUrl: "https://www.youtube.com/embed/iaBVSJm78ko",
    tips: ["Quick dip at knees", "Explosive leg drive", "Catch overhead with locked arms", "Lower with control"]
  },
  {
    name: "Cable Lateral Raises",
    description: "Cable lateral raises provide constant tension throughout the movement. Stand sideways to the cable and raise your arm out to the side.",
    muscles: ["Side Deltoids"],
    videoUrl: "https://www.youtube.com/embed/PPrzBWZDOhA",
    tips: ["Stand sideways to cable", "Cable behind or in front", "Raise to shoulder height", "Constant tension throughout"]
  },
  {
    name: "Machine Lateral Raises",
    description: "Machine lateral raises provide a fixed path for consistent side deltoid isolation.",
    muscles: ["Side Deltoids"],
    videoUrl: "https://www.youtube.com/embed/E6Axtw4gJhU",
    tips: ["Adjust seat height properly", "Lead with elbows", "Control the negative", "Don't use momentum"]
  },
  {
    name: "Rear Delt Flyes",
    description: "Rear delt flyes specifically target the posterior deltoids. Bend forward and raise dumbbells out to the sides.",
    muscles: ["Rear Deltoids", "Rhomboids"],
    videoUrl: "https://www.youtube.com/embed/oLrBaVNVdkE",
    tips: ["Bend at hips 45-90 degrees", "Raise out to sides", "Lead with elbows", "Squeeze rear delts at top"]
  },
  {
    name: "Dumbbell Shrugs",
    description: "Dumbbell shrugs allow for natural arm position and greater range of motion than barbell shrugs.",
    muscles: ["Traps"],
    videoUrl: "https://www.youtube.com/embed/g6qbq4Lf1FI",
    tips: ["Hold dumbbells at sides", "Shrug straight up", "Hold at top", "Don't roll shoulders"]
  },
  {
    name: "Barbell Shrugs",
    description: "Barbell shrugs allow you to use heavier weight for trap development. Hold barbell in front and shrug shoulders toward ears.",
    muscles: ["Traps"],
    videoUrl: "https://www.youtube.com/embed/NAqCVe2mwzM",
    tips: ["Grip slightly wider than shoulders", "Shrug straight up", "Hold at top briefly", "Control the descent"]
  },

  // ARMS - BICEPS
  {
    name: "Bicep Curls",
    description: "Bicep curls are the fundamental exercise for building arm size. Hold dumbbells at your sides with palms facing forward and curl them up toward your shoulders.",
    muscles: ["Biceps"],
    videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
    tips: ["Keep elbows at your sides", "Full range of motion", "Don't swing your body", "Squeeze at the top"]
  },
  {
    name: "Hammer Curls",
    description: "Hammer curls target the brachialis and brachioradialis in addition to the biceps, helping build arm thickness. Hold dumbbells with palms facing each other and curl.",
    muscles: ["Biceps", "Brachialis", "Forearms"],
    videoUrl: "https://www.youtube.com/embed/zC3nLlEvin4",
    tips: ["Keep palms facing each other", "Elbows stay stationary", "Curl to shoulder level", "Control the negative"]
  },
  {
    name: "Barbell Curl",
    description: "The barbell curl allows you to use heavier weight for bicep development. Stand with a barbell, palms facing up, and curl the weight toward your shoulders.",
    muscles: ["Biceps"],
    videoUrl: "https://www.youtube.com/embed/kwG2ipFRgfo",
    tips: ["Keep elbows pinned", "Don't swing for momentum", "Squeeze at the top", "Control the eccentric"]
  },
  {
    name: "Preacher Curl",
    description: "Preacher curls isolate the biceps by eliminating momentum and cheating. Rest your arms on a preacher bench and curl the weight up.",
    muscles: ["Biceps"],
    videoUrl: "https://www.youtube.com/embed/fIWP-FRFNU0",
    tips: ["Keep upper arms on pad", "Don't fully extend at bottom", "Squeeze at top", "Control the descent"]
  },
  {
    name: "Concentration Curl",
    description: "Concentration curls provide maximum bicep isolation. Sit on a bench, brace your elbow against your inner thigh, and curl the dumbbell up.",
    muscles: ["Biceps"],
    videoUrl: "https://www.youtube.com/embed/0AUGkch3tzc",
    tips: ["Brace elbow on thigh", "Curl with control", "Squeeze at top", "Full extension at bottom"]
  },
  {
    name: "Incline Dumbbell Curl",
    description: "Incline dumbbell curls stretch the bicep at the start position for greater muscle activation. Lie back on an incline bench and curl.",
    muscles: ["Biceps"],
    videoUrl: "https://www.youtube.com/embed/soxrZlIl35U",
    tips: ["Set bench to 45-60 degrees", "Let arms hang straight down", "Curl without moving upper arms", "Great stretch at bottom"]
  },
  {
    name: "Cable Curl",
    description: "Cable curls provide constant tension throughout the entire range of motion. Stand at a cable station and curl the bar or rope.",
    muscles: ["Biceps"],
    videoUrl: "https://www.youtube.com/embed/NFzTWp2qpiE",
    tips: ["Keep elbows at sides", "Constant tension throughout", "Squeeze at top", "Control the negative"]
  },
  {
    name: "EZ Bar Curl",
    description: "EZ bar curls reduce wrist strain compared to straight bar curls. The angled grip is easier on the joints.",
    muscles: ["Biceps"],
    videoUrl: "https://www.youtube.com/embed/zG2xJ0Q5QtI",
    tips: ["Use angled grip", "Keep elbows stationary", "Easier on wrists", "Full range of motion"]
  },
  {
    name: "Spider Curl",
    description: "Spider curls are performed face down on an incline bench, eliminating momentum and isolating the biceps.",
    muscles: ["Biceps"],
    videoUrl: "https://www.youtube.com/embed/58JOk_J1ZfI",
    tips: ["Lie face down on incline", "Arms hang straight down", "Curl without swinging", "Constant tension"]
  },
  {
    name: "Reverse Curl",
    description: "Reverse curls target the brachioradialis and forearms by curling with palms facing down.",
    muscles: ["Forearms", "Brachioradialis", "Biceps"],
    videoUrl: "https://www.youtube.com/embed/nRgxYX2Ve9w",
    tips: ["Palms face down", "Keep elbows at sides", "Targets forearms", "Use lighter weight"]
  },
  {
    name: "21s",
    description: "21s are a bicep curl variation: 7 reps bottom half, 7 reps top half, 7 reps full range for maximum pump.",
    muscles: ["Biceps"],
    videoUrl: "https://www.youtube.com/embed/P3PAL3sIU30",
    tips: ["7 lower half reps", "7 upper half reps", "7 full range reps", "Great for pump and burn"]
  },

  // ARMS - TRICEPS
  {
    name: "Tricep Dips",
    description: "Tricep dips are a compound movement that heavily targets the triceps. Keep your body more upright than chest dips to emphasize the triceps.",
    muscles: ["Triceps", "Chest", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/0326dy_-CzM",
    tips: ["Stay more upright for triceps", "Lower to 90 degree elbow bend", "Keep elbows close to body", "Don't go too deep"]
  },
  {
    name: "Tricep Pushdown",
    description: "Tricep pushdowns isolate the triceps using a cable machine. Stand at the cable station, grip the attachment, and push down until your arms are fully extended.",
    muscles: ["Triceps"],
    videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU",
    tips: ["Keep elbows pinned at sides", "Push to full extension", "Squeeze triceps at bottom", "Control the return"]
  },
  {
    name: "Skull Crushers",
    description: "Skull crushers (lying tricep extensions) target all three heads of the triceps. Lie on a bench, hold a barbell or EZ bar above your chest, and lower it toward your forehead.",
    muscles: ["Triceps"],
    videoUrl: "https://www.youtube.com/embed/d_KZxkY_0cM",
    tips: ["Keep upper arms stationary", "Lower to forehead or behind head", "Extend fully at top", "Don't flare elbows"]
  },
  {
    name: "Overhead Tricep Extension",
    description: "Overhead tricep extensions emphasize the long head of the triceps. Hold a dumbbell or cable overhead and lower it behind your head, then extend back up.",
    muscles: ["Triceps"],
    videoUrl: "https://www.youtube.com/embed/_gsUck-7M74",
    tips: ["Keep elbows close to head", "Lower behind your head", "Extend fully at top", "Don't arch lower back"]
  },
  {
    name: "Close Grip Bench Press",
    description: "Close grip bench press shifts emphasis from the chest to the triceps. Use a grip that's slightly narrower than shoulder width and keep elbows close to your body.",
    muscles: ["Triceps", "Chest", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/nEF0bv2FW94",
    tips: ["Grip narrower than regular bench", "Keep elbows close to body", "Lower to lower chest", "Full lockout at top"]
  },
  {
    name: "Diamond Push-ups",
    description: "Diamond push-ups are a bodyweight tricep exercise. Place your hands close together under your chest forming a diamond shape with your fingers, then perform push-ups.",
    muscles: ["Triceps", "Chest", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/J0DnG1_S92I",
    tips: ["Hands form diamond shape", "Elbows stay close to body", "Lower chest to hands", "Full extension at top"]
  },
  {
    name: "Rope Tricep Pushdown",
    description: "Rope pushdowns allow you to spread the rope at the bottom for a greater tricep contraction and squeeze.",
    muscles: ["Triceps"],
    videoUrl: "https://www.youtube.com/embed/vB5OHsJ3EME",
    tips: ["Keep elbows at sides", "Spread rope at bottom", "Squeeze triceps hard", "Control the return"]
  },
  {
    name: "Straight Bar Tricep Pushdown",
    description: "Straight bar pushdowns emphasize the lateral head of the triceps. Push the bar down while keeping elbows pinned.",
    muscles: ["Triceps"],
    videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU",
    tips: ["Grip bar overhand", "Keep elbows at sides", "Full extension", "Don't lean forward too much"]
  },
  {
    name: "Cable Overhead Tricep Extension",
    description: "Cable overhead extensions provide constant tension on the triceps. Face away from the cable and extend overhead.",
    muscles: ["Triceps"],
    videoUrl: "https://www.youtube.com/embed/xFAv3p5dETs",
    tips: ["Face away from cable", "Extend overhead", "Keep elbows close to head", "Squeeze at full extension"]
  },
  {
    name: "Dumbbell Kickback",
    description: "Tricep kickbacks isolate the triceps. Bend at the hips, keep upper arm parallel to floor, and extend the dumbbell back.",
    muscles: ["Triceps"],
    videoUrl: "https://www.youtube.com/embed/6SS6K3lAwZ8",
    tips: ["Upper arm parallel to floor", "Extend fully behind you", "Squeeze at top", "Don't swing the weight"]
  },
  {
    name: "Bench Dips",
    description: "Bench dips are done with hands on a bench behind you. Lower your body by bending elbows, then push back up.",
    muscles: ["Triceps", "Chest", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/6kALZikXxLc",
    tips: ["Hands grip bench edge", "Keep back close to bench", "Lower to 90 degree elbows", "Don't go too deep"]
  },
  {
    name: "JM Press",
    description: "JM Press is a hybrid between close grip bench and skull crushers, targeting the triceps with heavy weight.",
    muscles: ["Triceps", "Chest"],
    videoUrl: "https://www.youtube.com/embed/k3K6VPMa7c8",
    tips: ["Lower bar to chin/throat area", "Elbows tuck in", "Hybrid movement", "Great for tricep strength"]
  },
  {
    name: "Tate Press",
    description: "Tate press is performed by lowering dumbbells to your chest with elbows pointing out, then extending back up.",
    muscles: ["Triceps"],
    videoUrl: "https://www.youtube.com/embed/v4E2hkFzjOk",
    tips: ["Lie on flat bench", "Elbows point outward", "Lower dumbbells to chest", "Extend by straightening arms"]
  },

  // LEGS
  {
    name: "Squat",
    description: "The squat is the king of leg exercises, targeting the entire lower body. Stand with a barbell on your upper back, squat down until your thighs are parallel or below, then stand back up.",
    muscles: ["Quads", "Glutes", "Hamstrings", "Core"],
    videoUrl: "https://www.youtube.com/embed/bEv6CCg2BC8",
    tips: ["Keep chest up, back straight", "Knees track over toes", "Go to parallel or below", "Drive through heels"]
  },
  {
    name: "Leg Press",
    description: "The leg press is a machine exercise that targets the quads, glutes, and hamstrings. Sit in the machine with feet on the platform and press the weight by extending your legs.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/IZxyjW7MPJQ",
    tips: ["Don't lock out knees", "Lower with control", "Keep lower back on pad", "Foot position changes emphasis"]
  },
  {
    name: "Lunges",
    description: "Lunges are a unilateral exercise that builds leg strength and balance. Step forward, lower your back knee toward the ground, then push back to standing.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/QOVaHwm-Q6U",
    tips: ["Take a big step forward", "Front knee stays over ankle", "Lower back knee to floor", "Push through front heel"]
  },
  {
    name: "Romanian Deadlift",
    description: "Romanian deadlifts target the hamstrings and glutes with a hip hinge movement. Hold a barbell, push your hips back while keeping legs nearly straight, then return to standing.",
    muscles: ["Hamstrings", "Glutes", "Lower Back"],
    videoUrl: "https://www.youtube.com/embed/JCXUYuzwNrM",
    tips: ["Keep back flat", "Push hips back", "Slight knee bend only", "Feel stretch in hamstrings"]
  },
  {
    name: "Leg Curls",
    description: "Leg curls isolate the hamstrings. Lie face down on the machine and curl the weight up by bending your knees.",
    muscles: ["Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/1Tq3QdYUuHs",
    tips: ["Keep hips on pad", "Curl all the way up", "Control the negative", "Don't use momentum"]
  },
  {
    name: "Leg Extensions",
    description: "Leg extensions isolate the quadriceps. Sit in the machine with pad on your shins and extend your legs to straighten them.",
    muscles: ["Quads"],
    videoUrl: "https://www.youtube.com/embed/YyvSfVjQeL0",
    tips: ["Full extension at top", "Control the descent", "Don't swing the weight", "Squeeze quads at top"]
  },
  {
    name: "Calf Raises",
    description: "Calf raises build the calf muscles. Stand on a platform with heels hanging off, lower your heels, then raise up onto your toes.",
    muscles: ["Calves"],
    videoUrl: "https://www.youtube.com/embed/-M4-G8p8fmc",
    tips: ["Full range of motion", "Pause at the top", "Control the negative", "Can do seated or standing"]
  },
  {
    name: "Hip Thrusts",
    description: "Hip thrusts are the best exercise for glute development. Sit with your back against a bench, place a barbell over your hips, and thrust up by squeezing your glutes.",
    muscles: ["Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/SEdqd1n0cvg",
    tips: ["Drive through heels", "Squeeze glutes at top", "Don't hyperextend lower back", "Chin stays tucked"]
  },
  {
    name: "Bulgarian Split Squat",
    description: "Bulgarian split squats are a challenging unilateral exercise. Place one foot on a bench behind you and squat down on the front leg.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/2C-uNgKwPLE",
    tips: ["Rear foot elevated on bench", "Keep torso upright", "Front knee tracks over toes", "Lower until thigh is parallel"]
  },
  {
    name: "Goblet Squat",
    description: "Goblet squats are beginner-friendly and help teach proper squat form. Hold a dumbbell or kettlebell at chest level and squat down.",
    muscles: ["Quads", "Glutes", "Core"],
    videoUrl: "https://www.youtube.com/embed/MeIiIdhvXT4",
    tips: ["Hold weight at chest", "Elbows inside knees at bottom", "Keep chest up", "Go deep if mobility allows"]
  },
  {
    name: "Step-ups",
    description: "Step-ups are a functional unilateral exercise. Step onto a box or bench and drive through your heel to stand on top, then lower back down.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/dQqApCGd5Ss",
    tips: ["Drive through front heel", "Don't push off back foot", "Control the descent", "Keep torso upright"]
  },
  {
    name: "Front Squat",
    description: "Front squat places the bar on front shoulders, emphasizing quads and requiring more core stability.",
    muscles: ["Quads", "Glutes", "Core"],
    videoUrl: "https://www.youtube.com/embed/m4ytaCJZpl0",
    tips: ["Bar rests on front delts", "Elbows up high", "Stay more upright", "Great for quad focus"]
  },
  {
    name: "Back Squat",
    description: "Back squat is the traditional squat with barbell on upper back. The king of leg exercises for overall development.",
    muscles: ["Quads", "Glutes", "Hamstrings", "Core"],
    videoUrl: "https://www.youtube.com/embed/bEv6CCg2BC8",
    tips: ["Bar on upper traps", "Brace core tight", "Knees track over toes", "Drive through heels"]
  },
  {
    name: "Hack Squat",
    description: "Hack squat machine allows heavy quad training with reduced lower back stress. Shoulders under pads, feet on platform.",
    muscles: ["Quads", "Glutes"],
    videoUrl: "https://www.youtube.com/embed/0tn5K9NlCfo",
    tips: ["Shoulders under pads", "Feet placement affects focus", "Don't lock out knees", "Control the descent"]
  },
  {
    name: "Box Squat",
    description: "Box squat teaches proper squat depth and develops explosive power. Squat down to a box, pause, then stand.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/vYijF-hqg0E",
    tips: ["Sit back to box", "Pause on box briefly", "Explode up powerfully", "Great for learning depth"]
  },
  {
    name: "Sumo Squat",
    description: "Sumo squat uses a wide stance to emphasize inner thighs and glutes. Feet wide, toes pointed out.",
    muscles: ["Inner Thighs", "Glutes", "Quads"],
    videoUrl: "https://www.youtube.com/embed/9ZuXKqRbT9k",
    tips: ["Wide stance", "Toes pointed outward", "Knees track over toes", "Squeeze glutes at top"]
  },
  {
    name: "Walking Lunges",
    description: "Walking lunges are a dynamic lunge variation. Step forward into a lunge, then bring the back foot forward and continue.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/L8fvypPrzzs",
    tips: ["Take long strides", "Back knee toward floor", "Keep torso upright", "Drive through front heel"]
  },
  {
    name: "Reverse Lunges",
    description: "Reverse lunges step backward instead of forward, which is easier on the knees and emphasizes glutes more.",
    muscles: ["Glutes", "Quads", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/xrPteyQLGAo",
    tips: ["Step backward", "Easier on knees than forward", "Lower back knee to floor", "Push through front heel"]
  },
  {
    name: "Lateral Lunges",
    description: "Lateral lunges work the inner and outer thighs by stepping to the side. Step wide, push hips back, and return.",
    muscles: ["Inner Thighs", "Outer Thighs", "Glutes"],
    videoUrl: "https://www.youtube.com/embed/gwWv7aPcD88",
    tips: ["Step wide to side", "Push hips back", "Keep other leg straight", "Return to center"]
  },
  {
    name: "Sissy Squat",
    description: "Sissy squat is an advanced quad isolation exercise. Lean back while rising on toes and bending knees forward.",
    muscles: ["Quads"],
    videoUrl: "https://www.youtube.com/embed/032Xl1gfKKE",
    tips: ["Rise onto toes", "Lean torso back", "Knees travel forward", "Extreme quad isolation"]
  },
  {
    name: "Standing Calf Raises",
    description: "Standing calf raises emphasize the gastrocnemius (outer calf). Stand on a platform and raise up onto your toes.",
    muscles: ["Calves"],
    videoUrl: "https://www.youtube.com/embed/gwLzBJYoWlI",
    tips: ["Full range of motion", "Pause at top", "Control the negative", "Legs straight or slightly bent"]
  },
  {
    name: "Seated Calf Raises",
    description: "Seated calf raises target the soleus (inner calf). Sit with pads on thighs and raise heels.",
    muscles: ["Calves"],
    videoUrl: "https://www.youtube.com/embed/JbyjNymZOt0",
    tips: ["Knees bent at 90 degrees", "Full range of motion", "Pause at top", "Targets soleus muscle"]
  },
  {
    name: "Donkey Calf Raises",
    description: "Donkey calf raises allow for a deep stretch at the bottom. Bend at hips and raise heels.",
    muscles: ["Calves"],
    videoUrl: "https://www.youtube.com/embed/jxPO_yqbnPQ",
    tips: ["Bend at hips 90 degrees", "Great stretch at bottom", "Rise onto toes", "Classic bodybuilding exercise"]
  },
  {
    name: "Single Leg Leg Press",
    description: "Single leg leg press helps address muscle imbalances. Use one leg at a time on the leg press machine.",
    muscles: ["Quads", "Glutes"],
    videoUrl: "https://www.youtube.com/embed/NQJAq4cGxwU",
    tips: ["One leg at a time", "Control the weight", "Don't lock knee", "Great for imbalances"]
  },
  {
    name: "Lying Leg Curl",
    description: "Lying leg curl isolates the hamstrings. Lie face down and curl the pad toward your glutes.",
    muscles: ["Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/1Tq3QdYUuHs",
    tips: ["Lie face down", "Keep hips on pad", "Curl all the way up", "Control the negative"]
  },
  {
    name: "Seated Leg Curl",
    description: "Seated leg curl provides a different angle for hamstring training. Sit with pad behind ankles and curl toward glutes.",
    muscles: ["Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/Orxowest56U",
    tips: ["Adjust pad position", "Curl toward glutes", "Control the movement", "Don't use momentum"]
  },
  {
    name: "Good Mornings",
    description: "Good mornings are a hip hinge movement targeting posterior chain. Bar on upper back, hinge at hips while keeping legs nearly straight.",
    muscles: ["Hamstrings", "Glutes", "Lower Back"],
    videoUrl: "https://www.youtube.com/embed/Ixa0qfVorjY",
    tips: ["Bar on upper back", "Push hips back", "Slight knee bend", "Keep back flat"]
  },
  {
    name: "Glute Bridge",
    description: "Glute bridge is a hip extension exercise for glutes. Lie on back, feet flat, and drive hips up.",
    muscles: ["Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/wPM8icPu6H8",
    tips: ["Feet flat on floor", "Drive through heels", "Squeeze glutes at top", "Don't hyperextend back"]
  },
  {
    name: "Single Leg Hip Thrust",
    description: "Single leg hip thrust increases difficulty and addresses imbalances. Perform hip thrust with one leg extended.",
    muscles: ["Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/EqjGKsiIMCE",
    tips: ["One leg extended", "Other foot drives into floor", "Squeeze glute at top", "Keep hips level"]
  },
  {
    name: "Cable Pull Through",
    description: "Cable pull through is a hip hinge movement using a cable between your legs. Great for teaching hip hinge pattern.",
    muscles: ["Glutes", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/MJB8eJYhdL4",
    tips: ["Face away from cable", "Grip between legs", "Hip hinge movement", "Squeeze glutes at top"]
  },

  // CORE
  {
    name: "Plank",
    description: "The plank is an isometric core exercise that builds stability and endurance. Hold a push-up position with your body in a straight line, supporting yourself on forearms and toes.",
    muscles: ["Core", "Shoulders", "Back"],
    videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
    tips: ["Keep body in straight line", "Don't let hips sag or pike", "Engage glutes and core", "Breathe normally"]
  },
  {
    name: "Crunches",
    description: "Crunches target the rectus abdominis (six-pack muscles). Lie on your back with knees bent and curl your shoulders off the ground.",
    muscles: ["Abs"],
    videoUrl: "https://www.youtube.com/embed/Xyd_fa5zoEU",
    tips: ["Don't pull on neck", "Lift shoulders, not full sit-up", "Exhale as you crunch", "Focus on ab contraction"]
  },
  {
    name: "Russian Twists",
    description: "Russian twists work the obliques through rotation. Sit with knees bent, lean back slightly, and rotate side to side while holding a weight.",
    muscles: ["Obliques", "Abs"],
    videoUrl: "https://www.youtube.com/embed/wkD8rjkodUI",
    tips: ["Keep feet elevated for more challenge", "Rotate from the core", "Touch weight to floor each side", "Keep chest up"]
  },
  {
    name: "Leg Raises",
    description: "Leg raises target the lower abs. Lie on your back or hang from a bar and raise your legs up while keeping them straight.",
    muscles: ["Lower Abs", "Hip Flexors"],
    videoUrl: "https://www.youtube.com/embed/JB2oyawG9KI",
    tips: ["Keep lower back pressed down", "Control the descent", "Don't swing", "Bend knees if needed"]
  },
  {
    name: "Mountain Climbers",
    description: "Mountain climbers are a dynamic core exercise that also elevates heart rate. Start in a push-up position and alternate driving your knees toward your chest.",
    muscles: ["Core", "Hip Flexors", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/nmwgirgXLYM",
    tips: ["Keep hips level", "Drive knees forward", "Maintain plank position", "Start slow, then speed up"]
  },
  {
    name: "Dead Bug",
    description: "Dead bugs teach core stability and coordination. Lie on your back with arms up and knees bent 90 degrees, then alternate lowering opposite arm and leg.",
    muscles: ["Core", "Lower Back"],
    videoUrl: "https://www.youtube.com/embed/I5xbsA71v1o",
    tips: ["Press lower back into floor", "Move slowly with control", "Opposite arm and leg", "Don't let back arch"]
  },
  {
    name: "Ab Wheel Rollout",
    description: "Ab wheel rollouts are an advanced core exercise. Kneel with hands on ab wheel, roll forward keeping core tight, then roll back to starting position.",
    muscles: ["Abs", "Lats", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/rqiTPdK1c_I",
    tips: ["Start from knees", "Keep core engaged", "Don't let hips sag", "Roll out only as far as you can control"]
  },
  {
    name: "Hanging Leg Raises",
    description: "Hanging leg raises are an advanced lower ab exercise. Hang from a bar and raise your legs up in front of you, keeping them straight.",
    muscles: ["Lower Abs", "Hip Flexors", "Grip"],
    videoUrl: "https://www.youtube.com/embed/hdng3Nm1x_E",
    tips: ["Minimize swinging", "Raise legs to at least parallel", "Lower with control", "Bend knees for easier version"]
  },
  {
    name: "Side Plank",
    description: "Side planks target the obliques and lateral core muscles. Lie on your side, prop yourself up on one forearm, and hold your body in a straight line.",
    muscles: ["Obliques", "Core", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/K2VljzCC16g",
    tips: ["Stack feet or stagger them", "Keep hips elevated", "Body in straight line", "Breathe normally"]
  },
  {
    name: "Bicycle Crunches",
    description: "Bicycle crunches work the entire core with a twisting motion. Alternate elbow to opposite knee while cycling legs.",
    muscles: ["Abs", "Obliques"],
    videoUrl: "https://www.youtube.com/embed/9FGilxCbdz8",
    tips: ["Hands behind head", "Elbow to opposite knee", "Extend other leg", "Don't pull on neck"]
  },
  {
    name: "V-Ups",
    description: "V-ups are an advanced core exercise. Simultaneously lift legs and torso to form a V shape.",
    muscles: ["Abs", "Hip Flexors"],
    videoUrl: "https://www.youtube.com/embed/7UVgs18Y1P4",
    tips: ["Start flat on back", "Lift legs and torso together", "Touch toes at top", "Lower with control"]
  },
  {
    name: "Flutter Kicks",
    description: "Flutter kicks target the lower abs. Lie on back and alternate kicking legs up and down.",
    muscles: ["Lower Abs", "Hip Flexors"],
    videoUrl: "https://www.youtube.com/embed/eEG9uXQp1Lc",
    tips: ["Keep lower back pressed down", "Small controlled kicks", "Don't let feet touch floor", "Keep core engaged"]
  },
  {
    name: "Toe Touches",
    description: "Toe touches target the upper abs. Lie on back with legs vertical and reach hands toward toes.",
    muscles: ["Abs"],
    videoUrl: "https://www.youtube.com/embed/9z0m9z6JBGA",
    tips: ["Legs straight up", "Reach toward toes", "Lift shoulders off floor", "Don't swing"]
  },
  {
    name: "Cable Woodchops",
    description: "Cable woodchops work the obliques through rotation. Pull the cable diagonally across your body.",
    muscles: ["Obliques", "Core"],
    videoUrl: "https://www.youtube.com/embed/pAplQXk3dkU",
    tips: ["Rotate through core", "Keep arms relatively straight", "Control the movement", "Do both sides"]
  },
  {
    name: "Pallof Press",
    description: "Pallof press trains anti-rotation core stability. Hold a cable and press it straight out, resisting rotation.",
    muscles: ["Core", "Obliques"],
    videoUrl: "https://www.youtube.com/embed/AH_QZLm_0-s",
    tips: ["Stand sideways to cable", "Press straight out", "Resist rotation", "Hold at full extension"]
  },
  {
    name: "Reverse Crunches",
    description: "Reverse crunches target the lower abs by bringing knees toward chest.",
    muscles: ["Lower Abs"],
    videoUrl: "https://www.youtube.com/embed/hyv14e2QDq0",
    tips: ["Curl hips off floor", "Bring knees toward chest", "Control the negative", "Don't use momentum"]
  },

  // CARDIO / CONDITIONING
  {
    name: "Burpees",
    description: "Burpees are a full-body conditioning exercise. Squat down, jump back to a push-up position, do a push-up, jump feet forward, and explode up with a jump.",
    muscles: ["Full Body", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/JZQA08SlJnM",
    tips: ["Maintain good form throughout", "Scale as needed", "Land softly on jumps", "Keep a steady pace"]
  },
  {
    name: "Jumping Jacks",
    description: "Jumping jacks are a classic cardio exercise. Jump while spreading legs and raising arms overhead, then jump back to starting position.",
    muscles: ["Full Body", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/c4DAnQ6DtF8",
    tips: ["Land softly", "Full arm extension", "Keep a steady rhythm", "Modify to step-jacks if needed"]
  },
  {
    name: "Box Jumps",
    description: "Box jumps build explosive power. Stand in front of a box, swing arms and jump up, landing softly on top of the box, then step down.",
    muscles: ["Quads", "Glutes", "Calves"],
    videoUrl: "https://www.youtube.com/embed/52r_Ul5k03g",
    tips: ["Start with lower box", "Land softly with bent knees", "Step down, don't jump", "Use arm swing for momentum"]
  },
  {
    name: "Battle Ropes",
    description: "Battle ropes provide a high-intensity upper body and cardio workout. Hold the ends of heavy ropes and create waves using alternating or simultaneous arm movements.",
    muscles: ["Shoulders", "Arms", "Core", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/4LbS7EJ8k1k",
    tips: ["Maintain athletic stance", "Keep core engaged", "Try different wave patterns", "Start with short intervals"]
  },
  {
    name: "Kettlebell Swing",
    description: "Kettlebell swings are a hip hinge movement that builds posterior chain power and conditioning. Swing the kettlebell between your legs and up to chest height using hip drive.",
    muscles: ["Glutes", "Hamstrings", "Core", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/YSxHifyI6s8",
    tips: ["Hip hinge, not squat", "Drive with hips, not arms", "Keep arms relaxed", "Squeeze glutes at top"]
  },
  {
    name: "Rowing Machine",
    description: "The rowing machine provides a full-body cardiovascular workout. Drive with your legs, lean back slightly, then pull the handle to your chest.",
    muscles: ["Legs", "Back", "Arms", "Core"],
    videoUrl: "https://www.youtube.com/embed/H0r-bX0Ul6g",
    tips: ["Legs, back, arms sequence", "Drive through heels", "Don't hunch over", "Maintain consistent stroke rate"]
  },
  {
    name: "Jumping Lunges",
    description: "Jumping lunges are a plyometric exercise that builds explosive leg power. Perform a lunge, then explosively jump and switch legs in the air.",
    muscles: ["Quads", "Glutes", "Calves"],
    videoUrl: "https://www.youtube.com/embed/L-Bm7yB7bHI",
    tips: ["Land softly", "Keep torso upright", "Drive through front heel", "Scale to alternating lunges if needed"]
  },
  {
    name: "High Knees",
    description: "High knees are a cardio exercise that elevates heart rate. Run in place bringing knees up high toward chest.",
    muscles: ["Hip Flexors", "Core", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/D0FTqUgEcSI",
    tips: ["Drive knees up high", "Stay on balls of feet", "Pump arms", "Keep a quick pace"]
  },
  {
    name: "Butt Kicks",
    description: "Butt kicks are a cardio warm-up exercise. Run in place kicking heels up toward glutes.",
    muscles: ["Hamstrings", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/3OGoR-vDvqM",
    tips: ["Kick heels to glutes", "Stay light on feet", "Good warm-up exercise", "Keep steady rhythm"]
  },
  {
    name: "Jump Squats",
    description: "Jump squats build explosive leg power. Squat down and explosively jump up, landing softly back into a squat.",
    muscles: ["Quads", "Glutes", "Calves"],
    videoUrl: "https://www.youtube.com/embed/U4s4mEQ5VqU",
    tips: ["Squat to parallel", "Explode up", "Land softly with bent knees", "Use arm swing for power"]
  },
  {
    name: "Skater Jumps",
    description: "Skater jumps are lateral plyometric exercises. Jump side to side, landing on one foot like a speed skater.",
    muscles: ["Glutes", "Outer Thighs", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/d3k2iSHhyxU",
    tips: ["Jump laterally", "Land on one foot", "Touch floor with opposite hand", "Stay low"]
  },
  {
    name: "Squat Thrusts",
    description: "Squat thrusts are similar to burpees but without the push-up and jump. Squat, jump feet back, then return.",
    muscles: ["Full Body", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/DpYhVpUIq44",
    tips: ["Squat down", "Jump feet back to plank", "Jump feet forward", "Stand and repeat"]
  },
  {
    name: "Plyo Push-ups",
    description: "Plyo push-ups are explosive push-ups where hands leave the ground. Great for building chest power.",
    muscles: ["Chest", "Triceps", "Shoulders"],
    videoUrl: "https://www.youtube.com/embed/EYwWCgM198U",
    tips: ["Explode up from push-up", "Hands leave ground", "Land with soft elbows", "Progress gradually"]
  },
  {
    name: "Treadmill Sprints",
    description: "Treadmill sprints are high-intensity intervals on a treadmill. Sprint for short bursts followed by rest.",
    muscles: ["Legs", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/g8Eo-e5xJ6o",
    tips: ["Warm up first", "Sprint 20-30 seconds", "Rest or walk between", "Use safety clip"]
  },
  {
    name: "Stair Climber",
    description: "The stair climber machine provides steady-state cardio that targets legs and glutes.",
    muscles: ["Quads", "Glutes", "Calves", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/VpXfdS3ER8I",
    tips: ["Stand upright", "Don't lean on rails", "Take full steps", "Great for glutes"]
  },
  {
    name: "Elliptical",
    description: "The elliptical provides low-impact cardio with arm involvement. Great for joint-friendly conditioning.",
    muscles: ["Full Body", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/pqLvFJCvbpA",
    tips: ["Use arms actively", "Maintain good posture", "Low impact on joints", "Vary resistance and incline"]
  },
  {
    name: "Assault Bike",
    description: "The assault bike provides brutal full-body cardio. Both arms and legs work together for maximum calorie burn.",
    muscles: ["Full Body", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/nKdMnzFWSU4",
    tips: ["Push and pull with arms", "Drive with legs", "Pace yourself", "Great for HIIT"]
  },
  {
    name: "Sled Push",
    description: "Sled push is a conditioning exercise. Load a sled and push it for distance or time.",
    muscles: ["Quads", "Glutes", "Core", "Cardio"],
    videoUrl: "https://www.youtube.com/embed/W8lsGy7EPaE",
    tips: ["Drive with legs", "Keep body at 45 degrees", "Short choppy steps", "Great for leg conditioning"]
  },
  {
    name: "Sled Pull",
    description: "Sled pull works the posterior chain. Attach a rope and pull the sled toward you.",
    muscles: ["Back", "Biceps", "Hamstrings"],
    videoUrl: "https://www.youtube.com/embed/qYpjkTJBqxk",
    tips: ["Sit back and pull", "Hand over hand motion", "Engage back and legs", "Great for grip strength"]
  },
  {
    name: "Farmer's Walk",
    description: "Farmer's walk builds grip, core, and overall conditioning. Carry heavy weights and walk for distance or time.",
    muscles: ["Grip", "Core", "Traps", "Full Body"],
    videoUrl: "https://www.youtube.com/embed/Fkzk_RqlYig",
    tips: ["Heavy weight", "Stand tall", "Quick short steps", "Keep core braced"]
  },
  {
    name: "Bear Crawl",
    description: "Bear crawl is a full-body conditioning exercise. Crawl on hands and feet with knees hovering off ground.",
    muscles: ["Core", "Shoulders", "Full Body"],
    videoUrl: "https://www.youtube.com/embed/pv00BmEBU3k",
    tips: ["Hands under shoulders", "Knees hover off ground", "Move opposite arm and leg", "Keep hips low"]
  },
];

// Create a lookup map
const exerciseMap = new Map<string, ExerciseInfo>();
exerciseData.forEach(ex => {
  exerciseMap.set(normalizeExerciseName(ex.name), ex);
});

export function getExerciseInfo(name: string): ExerciseInfo | null {
  const normalized = normalizeExerciseName(name);
  
  // Exact match
  if (exerciseMap.has(normalized)) {
    return exerciseMap.get(normalized)!;
  }
  
  // Partial match - find if exercise name contains a known exercise
  for (const [key, value] of exerciseMap.entries()) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

export function getAllExercises(): ExerciseInfo[] {
  return exerciseData;
}
