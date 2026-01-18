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
