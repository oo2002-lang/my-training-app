'use client';

type MovementPattern =
  | 'squat' | 'hinge' | 'push' | 'pull' | 'clean'
  | 'jump' | 'bound' | 'sprint' | 'lunge' | 'hip_thrust'
  | 'plank' | 'backpedal' | 'lateral' | 'stretch' | 'curl'
  | 'raise' | 'throw' | 'generic';

const SLUG_TO_PATTERN: Record<string, MovementPattern> = {
  'squat': 'squat', 'front-squat': 'squat', 'goblet-squat': 'squat',
  'rdl': 'hinge', 'sl-rdl': 'hinge', 'trap-bar-dl': 'hinge',
  'power-clean': 'clean', 'hang-clean': 'clean', 'clean-pull': 'clean',
  'bench-press': 'push', 'db-incline': 'push', 'press-jam': 'push',
  'weighted-pullups': 'pull', 'db-row': 'pull',
  'box-jumps': 'jump', 'depth-jumps': 'jump', 'tuck-jumps': 'jump',
  'broad-jumps': 'jump', 'hurdle-hops': 'jump', 'sl-box-jumps': 'jump',
  'altitude-drops': 'jump', 'standing-lj': 'jump',
  'sl-bounds': 'bound', 'bounding': 'bound', 'lateral-bounds': 'lateral',
  '10yd-sprint': 'sprint', '20yd-sprint': 'sprint', '40yd-dash': 'sprint',
  '60m-sprint': 'sprint', '100m-sprint': 'sprint', 'flying-30m': 'sprint',
  'accel-30m': 'sprint', 'buildup-80': 'sprint', 'stride-outs': 'sprint',
  'bss': 'lunge', 'step-ups': 'lunge', 'walking-lunges': 'lunge',
  'hip-thrust': 'hip_thrust',
  'plank': 'plank',
  'nordic-curl': 'curl', 'hanging-leg-raise': 'curl',
  'backpedal': 'backpedal', 'backpedal-hip-turn': 'backpedal',
  'pedal-click-close': 'backpedal', 'flip-and-run': 'backpedal',
  '5-10-5': 'lateral', 't-drill': 'lateral', 'l-drill': 'lateral',
  'ladder': 'lateral', 'cone-weaves': 'lateral', 'star-drill': 'lateral',
  'w-drill': 'lateral',
  'face-pull': 'pull', 'lateral-raise': 'raise',
  'mb-rotational': 'throw', 'mb-slam': 'throw',
  'hip-flexor-stretch': 'stretch', 'leg-swings': 'stretch', 'foam-roll': 'stretch',
  'a-skips': 'bound', 'b-skips': 'bound', 'high-knees': 'bound', 'butt-kicks': 'bound',
  'pop-ups': 'jump', 'full-approach': 'sprint', 'short-approach': 'sprint',
  'runway-marks': 'sprint', 'approach-rhythm': 'sprint',
  'penultimate-drill': 'sprint', 'hang-technique': 'jump', 'landing-drills': 'jump',
  'break-on-ball': 'sprint', 'man-coverage': 'backpedal', 'zone-drops': 'backpedal',
  'trail-technique': 'backpedal', 'ball-drills': 'throw', 'film-study': 'generic',
  'gasser': 'sprint', '300yd-shuttle': 'sprint', 'tempo-200': 'sprint', 'tempo-100': 'sprint',
};

function getPattern(slug: string): MovementPattern {
  return SLUG_TO_PATTERN[slug] ?? 'generic';
}

const STYLES = `
  .stick-fig { stroke: #a1a1aa; stroke-width: 2.5; stroke-linecap: round; fill: none; }
  .stick-head { fill: #a1a1aa; stroke: none; }
  .ground { stroke: #3f3f46; stroke-width: 1; }
  .equipment { stroke: #60a5fa; stroke-width: 2.5; stroke-linecap: round; fill: none; }
  .equip-fill { fill: #60a5fa; stroke: none; opacity: 0.3; }

  @keyframes squat-body {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(14px); }
  }
  @keyframes squat-legs {
    0%, 100% { d: path("M50,62 L42,80 L38,95"); }
    50% { d: path("M50,62 L36,74 L32,82"); }
  }
  @keyframes squat-legs-r {
    0%, 100% { d: path("M50,62 L58,80 L62,95"); }
    50% { d: path("M50,62 L64,74 L68,82"); }
  }

  @keyframes hinge-torso {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(45deg); }
  }

  @keyframes push-arms {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-6px); }
  }

  @keyframes pull-arms {
    0%, 100% { transform: translateY(8px); }
    50% { transform: translateY(0); }
  }

  @keyframes clean-body {
    0% { transform: translateY(10px); }
    40% { transform: translateY(10px); }
    70% { transform: translateY(-5px); }
    100% { transform: translateY(0); }
  }

  @keyframes jump-body {
    0%, 100% { transform: translateY(0); }
    25% { transform: translateY(6px); }
    50% { transform: translateY(-18px); }
    75% { transform: translateY(-10px); }
  }

  @keyframes bound-left {
    0%, 100% { transform: translateX(0) translateY(0); }
    25% { transform: translateX(5px) translateY(-12px); }
    50% { transform: translateX(10px) translateY(0); }
    75% { transform: translateX(15px) translateY(-12px); }
  }

  @keyframes sprint-legs {
    0%, 100% { transform: rotate(-20deg); }
    50% { transform: rotate(20deg); }
  }
  @keyframes sprint-legs-r {
    0%, 100% { transform: rotate(20deg); }
    50% { transform: rotate(-20deg); }
  }
  @keyframes sprint-arms {
    0%, 100% { transform: rotate(20deg); }
    50% { transform: rotate(-20deg); }
  }
  @keyframes sprint-arms-r {
    0%, 100% { transform: rotate(-20deg); }
    50% { transform: rotate(20deg); }
  }

  @keyframes lunge-down {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }

  @keyframes thrust-hips {
    0%, 100% { transform: translateY(4px); }
    50% { transform: translateY(-2px); }
  }

  @keyframes backpedal-move {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(8px); }
  }

  @keyframes lateral-move {
    0%, 100% { transform: translateX(-8px); }
    50% { transform: translateX(8px); }
  }

  @keyframes curl-legs {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-40deg); }
  }

  @keyframes raise-arms {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-80deg); }
  }

  @keyframes throw-rotate {
    0%, 100% { transform: rotate(-30deg); }
    50% { transform: rotate(30deg); }
  }

  @keyframes stretch-reach {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(20deg); }
  }

  @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
`;

function SquatAnim() {
  return (
    <g>
      <g style={{ animation: 'squat-body 2s ease-in-out infinite' }}>
        <circle cx="50" cy="28" r="6" className="stick-head" />
        <line x1="50" y1="34" x2="50" y2="62" className="stick-fig" />
        <line x1="50" y1="42" x2="38" y2="52" className="stick-fig" />
        <line x1="50" y1="42" x2="62" y2="52" className="stick-fig" />
        <line x1="38" y1="52" x2="62" y2="52" className="equipment" />
      </g>
      <line x1="50" y1="62" x2="42" y2="80" className="stick-fig" style={{ animation: 'squat-body 2s ease-in-out infinite' }} />
      <line x1="42" y1="80" x2="38" y2="95" className="stick-fig" />
      <line x1="50" y1="62" x2="58" y2="80" className="stick-fig" style={{ animation: 'squat-body 2s ease-in-out infinite' }} />
      <line x1="58" y1="80" x2="62" y2="95" className="stick-fig" />
    </g>
  );
}

function HingeAnim() {
  return (
    <g>
      <g style={{ transformOrigin: '50px 65px', animation: 'hinge-torso 2.5s ease-in-out infinite' }}>
        <circle cx="50" cy="30" r="6" className="stick-head" />
        <line x1="50" y1="36" x2="50" y2="65" className="stick-fig" />
        <line x1="50" y1="44" x2="40" y2="58" className="stick-fig" />
        <line x1="50" y1="44" x2="60" y2="58" className="stick-fig" />
      </g>
      <line x1="50" y1="65" x2="42" y2="82" className="stick-fig" />
      <line x1="42" y1="82" x2="40" y2="95" className="stick-fig" />
      <line x1="50" y1="65" x2="58" y2="82" className="stick-fig" />
      <line x1="58" y1="82" x2="60" y2="95" className="stick-fig" />
    </g>
  );
}

function PushAnim() {
  return (
    <g transform="rotate(-90, 50, 55) translate(0, -5)">
      <circle cx="30" cy="55" r="5" className="stick-head" />
      <line x1="35" y1="55" x2="65" y2="55" className="stick-fig" />
      <g style={{ animation: 'push-arms 1.5s ease-in-out infinite' }}>
        <line x1="45" y1="55" x2="40" y2="70" className="stick-fig" />
        <line x1="40" y1="70" x2="40" y2="80" className="stick-fig" />
      </g>
      <line x1="65" y1="55" x2="72" y2="65" className="stick-fig" />
      <line x1="65" y1="55" x2="72" y2="45" className="stick-fig" />
      <line x1="20" y1="80" x2="80" y2="80" className="ground" />
    </g>
  );
}

function PullAnim() {
  return (
    <g>
      <line x1="30" y1="15" x2="70" y2="15" className="equipment" />
      <g style={{ animation: 'pull-arms 2s ease-in-out infinite' }}>
        <circle cx="50" cy="30" r="6" className="stick-head" />
        <line x1="50" y1="36" x2="50" y2="65" className="stick-fig" />
        <line x1="50" y1="40" x2="40" y2="20" className="stick-fig" />
        <line x1="50" y1="40" x2="60" y2="20" className="stick-fig" />
        <line x1="50" y1="65" x2="45" y2="80" className="stick-fig" />
        <line x1="50" y1="65" x2="55" y2="80" className="stick-fig" />
      </g>
    </g>
  );
}

function CleanAnim() {
  return (
    <g style={{ animation: 'clean-body 1.8s ease-in-out infinite' }}>
      <circle cx="50" cy="26" r="6" className="stick-head" />
      <line x1="50" y1="32" x2="50" y2="60" className="stick-fig" />
      <line x1="50" y1="42" x2="38" y2="38" className="stick-fig" />
      <line x1="38" y1="38" x2="34" y2="50" className="stick-fig" />
      <line x1="50" y1="42" x2="62" y2="38" className="stick-fig" />
      <line x1="62" y1="38" x2="66" y2="50" className="stick-fig" />
      <line x1="34" y1="50" x2="66" y2="50" className="equipment" />
      <line x1="50" y1="60" x2="42" y2="78" className="stick-fig" />
      <line x1="42" y1="78" x2="40" y2="95" className="stick-fig" />
      <line x1="50" y1="60" x2="58" y2="78" className="stick-fig" />
      <line x1="58" y1="78" x2="60" y2="95" className="stick-fig" />
    </g>
  );
}

function JumpAnim() {
  return (
    <g style={{ animation: 'jump-body 1.5s ease-in-out infinite' }}>
      <circle cx="50" cy="28" r="6" className="stick-head" />
      <line x1="50" y1="34" x2="50" y2="60" className="stick-fig" />
      <line x1="50" y1="42" x2="38" y2="34" className="stick-fig" />
      <line x1="50" y1="42" x2="62" y2="34" className="stick-fig" />
      <line x1="50" y1="60" x2="42" y2="78" className="stick-fig" />
      <line x1="42" y1="78" x2="40" y2="95" className="stick-fig" />
      <line x1="50" y1="60" x2="58" y2="78" className="stick-fig" />
      <line x1="58" y1="78" x2="60" y2="95" className="stick-fig" />
    </g>
  );
}

function BoundAnim() {
  return (
    <g style={{ animation: 'bound-left 1.6s ease-in-out infinite' }}>
      <circle cx="45" cy="28" r="6" className="stick-head" />
      <line x1="45" y1="34" x2="45" y2="58" className="stick-fig" />
      <g style={{ transformOrigin: '45px 42px', animation: 'sprint-arms 0.8s ease-in-out infinite' }}>
        <line x1="45" y1="42" x2="35" y2="50" className="stick-fig" />
      </g>
      <g style={{ transformOrigin: '45px 42px', animation: 'sprint-arms-r 0.8s ease-in-out infinite' }}>
        <line x1="45" y1="42" x2="55" y2="50" className="stick-fig" />
      </g>
      <g style={{ transformOrigin: '45px 58px', animation: 'sprint-legs 0.8s ease-in-out infinite' }}>
        <line x1="45" y1="58" x2="40" y2="78" className="stick-fig" />
        <line x1="40" y1="78" x2="38" y2="95" className="stick-fig" />
      </g>
      <g style={{ transformOrigin: '45px 58px', animation: 'sprint-legs-r 0.8s ease-in-out infinite' }}>
        <line x1="45" y1="58" x2="50" y2="78" className="stick-fig" />
        <line x1="50" y1="78" x2="52" y2="95" className="stick-fig" />
      </g>
    </g>
  );
}

function SprintAnim() {
  return (
    <g transform="translate(5, 0)">
      <circle cx="50" cy="28" r="6" className="stick-head" />
      <line x1="50" y1="34" x2="48" y2="58" className="stick-fig" style={{ transform: 'rotate(10deg)', transformOrigin: '50px 34px' }} />
      <g style={{ transformOrigin: '48px 42px', animation: 'sprint-arms 0.5s ease-in-out infinite' }}>
        <line x1="48" y1="42" x2="38" y2="50" className="stick-fig" />
      </g>
      <g style={{ transformOrigin: '48px 42px', animation: 'sprint-arms-r 0.5s ease-in-out infinite' }}>
        <line x1="48" y1="42" x2="58" y2="50" className="stick-fig" />
      </g>
      <g style={{ transformOrigin: '48px 58px', animation: 'sprint-legs 0.5s ease-in-out infinite' }}>
        <line x1="48" y1="58" x2="40" y2="78" className="stick-fig" />
        <line x1="40" y1="78" x2="36" y2="95" className="stick-fig" />
      </g>
      <g style={{ transformOrigin: '48px 58px', animation: 'sprint-legs-r 0.5s ease-in-out infinite' }}>
        <line x1="48" y1="58" x2="56" y2="78" className="stick-fig" />
        <line x1="56" y1="78" x2="60" y2="95" className="stick-fig" />
      </g>
    </g>
  );
}

function LungeAnim() {
  return (
    <g style={{ animation: 'lunge-down 2s ease-in-out infinite' }}>
      <circle cx="50" cy="28" r="6" className="stick-head" />
      <line x1="50" y1="34" x2="50" y2="60" className="stick-fig" />
      <line x1="50" y1="42" x2="40" y2="52" className="stick-fig" />
      <line x1="50" y1="42" x2="60" y2="52" className="stick-fig" />
      <line x1="50" y1="60" x2="38" y2="78" className="stick-fig" />
      <line x1="38" y1="78" x2="35" y2="95" className="stick-fig" />
      <line x1="50" y1="60" x2="62" y2="80" className="stick-fig" />
      <line x1="62" y1="80" x2="68" y2="95" className="stick-fig" />
    </g>
  );
}

function HipThrustAnim() {
  return (
    <g>
      <rect x="15" y="60" width="20" height="20" rx="2" className="equipment" />
      <g style={{ animation: 'thrust-hips 2s ease-in-out infinite' }}>
        <circle cx="40" cy="50" r="5" className="stick-head" />
        <line x1="40" y1="55" x2="55" y2="65" className="stick-fig" />
        <line x1="55" y1="65" x2="70" y2="58" className="stick-fig" />
        <line x1="70" y1="58" x2="72" y2="75" className="stick-fig" />
        <line x1="55" y1="65" x2="58" y2="58" className="stick-fig" />
        <line x1="58" y1="58" x2="52" y2="75" className="stick-fig" />
      </g>
      <line x1="10" y1="80" x2="90" y2="80" className="ground" />
    </g>
  );
}

function PlankAnim() {
  return (
    <g>
      <circle cx="25" cy="58" r="5" className="stick-head" />
      <line x1="30" y1="60" x2="70" y2="60" className="stick-fig" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
      <line x1="30" y1="60" x2="28" y2="75" className="stick-fig" />
      <line x1="70" y1="60" x2="75" y2="75" className="stick-fig" />
      <line x1="75" y1="75" x2="78" y2="80" className="stick-fig" />
      <line x1="10" y1="80" x2="90" y2="80" className="ground" />
    </g>
  );
}

function BackpedalAnim() {
  return (
    <g style={{ animation: 'backpedal-move 1.5s ease-in-out infinite' }}>
      <circle cx="50" cy="28" r="6" className="stick-head" />
      <line x1="50" y1="34" x2="50" y2="60" className="stick-fig" />
      <line x1="50" y1="42" x2="42" y2="50" className="stick-fig" />
      <line x1="50" y1="42" x2="58" y2="50" className="stick-fig" />
      <g style={{ transformOrigin: '50px 60px', animation: 'sprint-legs 0.7s ease-in-out infinite' }}>
        <line x1="50" y1="60" x2="44" y2="78" className="stick-fig" />
        <line x1="44" y1="78" x2="42" y2="95" className="stick-fig" />
      </g>
      <g style={{ transformOrigin: '50px 60px', animation: 'sprint-legs-r 0.7s ease-in-out infinite' }}>
        <line x1="50" y1="60" x2="56" y2="78" className="stick-fig" />
        <line x1="56" y1="78" x2="58" y2="95" className="stick-fig" />
      </g>
    </g>
  );
}

function LateralAnim() {
  return (
    <g style={{ animation: 'lateral-move 1.2s ease-in-out infinite' }}>
      <circle cx="50" cy="30" r="6" className="stick-head" />
      <line x1="50" y1="36" x2="50" y2="62" className="stick-fig" />
      <line x1="50" y1="44" x2="40" y2="52" className="stick-fig" />
      <line x1="50" y1="44" x2="60" y2="52" className="stick-fig" />
      <line x1="50" y1="62" x2="38" y2="80" className="stick-fig" />
      <line x1="38" y1="80" x2="35" y2="95" className="stick-fig" />
      <line x1="50" y1="62" x2="62" y2="80" className="stick-fig" />
      <line x1="62" y1="80" x2="65" y2="95" className="stick-fig" />
    </g>
  );
}

function CurlAnim() {
  return (
    <g>
      <circle cx="50" cy="30" r="6" className="stick-head" />
      <line x1="50" y1="36" x2="50" y2="60" className="stick-fig" />
      <line x1="50" y1="44" x2="42" y2="52" className="stick-fig" />
      <line x1="50" y1="44" x2="58" y2="52" className="stick-fig" />
      <line x1="50" y1="60" x2="42" y2="78" className="stick-fig" />
      <line x1="42" y1="78" x2="40" y2="95" className="stick-fig" />
      <g style={{ transformOrigin: '50px 60px', animation: 'curl-legs 2s ease-in-out infinite' }}>
        <line x1="50" y1="60" x2="58" y2="78" className="stick-fig" />
        <line x1="58" y1="78" x2="60" y2="95" className="stick-fig" />
      </g>
    </g>
  );
}

function RaiseAnim() {
  return (
    <g>
      <circle cx="50" cy="30" r="6" className="stick-head" />
      <line x1="50" y1="36" x2="50" y2="62" className="stick-fig" />
      <g style={{ transformOrigin: '50px 44px', animation: 'raise-arms 2s ease-in-out infinite' }}>
        <line x1="50" y1="44" x2="36" y2="56" className="stick-fig" />
      </g>
      <g style={{ transformOrigin: '50px 44px', animation: 'raise-arms 2s ease-in-out infinite', transform: 'scaleX(-1)' }}>
        <line x1="50" y1="44" x2="36" y2="56" className="stick-fig" />
      </g>
      <line x1="50" y1="62" x2="44" y2="80" className="stick-fig" />
      <line x1="44" y1="80" x2="42" y2="95" className="stick-fig" />
      <line x1="50" y1="62" x2="56" y2="80" className="stick-fig" />
      <line x1="56" y1="80" x2="58" y2="95" className="stick-fig" />
    </g>
  );
}

function ThrowAnim() {
  return (
    <g style={{ transformOrigin: '50px 50px', animation: 'throw-rotate 1.5s ease-in-out infinite' }}>
      <circle cx="50" cy="28" r="6" className="stick-head" />
      <line x1="50" y1="34" x2="50" y2="60" className="stick-fig" />
      <line x1="50" y1="42" x2="38" y2="36" className="stick-fig" />
      <line x1="50" y1="42" x2="62" y2="48" className="stick-fig" />
      <circle cx="38" cy="34" r="4" className="equip-fill" />
      <circle cx="38" cy="34" r="4" className="equipment" />
      <line x1="50" y1="60" x2="44" y2="78" className="stick-fig" />
      <line x1="44" y1="78" x2="42" y2="95" className="stick-fig" />
      <line x1="50" y1="60" x2="56" y2="78" className="stick-fig" />
      <line x1="56" y1="78" x2="58" y2="95" className="stick-fig" />
    </g>
  );
}

function StretchAnim() {
  return (
    <g>
      <circle cx="40" cy="40" r="6" className="stick-head" />
      <g style={{ transformOrigin: '40px 46px', animation: 'stretch-reach 3s ease-in-out infinite' }}>
        <line x1="40" y1="46" x2="50" y2="68" className="stick-fig" />
        <line x1="45" y1="54" x2="55" y2="48" className="stick-fig" />
        <line x1="45" y1="54" x2="35" y2="48" className="stick-fig" />
      </g>
      <line x1="50" y1="68" x2="38" y2="85" className="stick-fig" />
      <line x1="38" y1="85" x2="30" y2="95" className="stick-fig" />
      <line x1="50" y1="68" x2="62" y2="85" className="stick-fig" />
      <line x1="62" y1="85" x2="70" y2="95" className="stick-fig" />
    </g>
  );
}

function GenericAnim() {
  return (
    <g style={{ animation: 'pulse 2s ease-in-out infinite' }}>
      <circle cx="50" cy="30" r="6" className="stick-head" />
      <line x1="50" y1="36" x2="50" y2="62" className="stick-fig" />
      <line x1="50" y1="44" x2="38" y2="54" className="stick-fig" />
      <line x1="50" y1="44" x2="62" y2="54" className="stick-fig" />
      <line x1="50" y1="62" x2="42" y2="80" className="stick-fig" />
      <line x1="42" y1="80" x2="40" y2="95" className="stick-fig" />
      <line x1="50" y1="62" x2="58" y2="80" className="stick-fig" />
      <line x1="58" y1="80" x2="60" y2="95" className="stick-fig" />
    </g>
  );
}

const PATTERN_COMPONENTS: Record<MovementPattern, () => React.ReactElement> = {
  squat: SquatAnim,
  hinge: HingeAnim,
  push: PushAnim,
  pull: PullAnim,
  clean: CleanAnim,
  jump: JumpAnim,
  bound: BoundAnim,
  sprint: SprintAnim,
  lunge: LungeAnim,
  hip_thrust: HipThrustAnim,
  plank: PlankAnim,
  backpedal: BackpedalAnim,
  lateral: LateralAnim,
  curl: CurlAnim,
  raise: RaiseAnim,
  throw: ThrowAnim,
  stretch: StretchAnim,
  generic: GenericAnim,
};

export default function ExerciseAnimation({ slug }: { slug: string }) {
  const pattern = getPattern(slug);
  const Component = PATTERN_COMPONENTS[pattern];

  return (
    <svg viewBox="0 0 100 100" width="80" height="80" aria-label="Exercise animation">
      <style>{STYLES}</style>
      <line x1="10" y1="97" x2="90" y2="97" className="ground" />
      <Component />
    </svg>
  );
}
