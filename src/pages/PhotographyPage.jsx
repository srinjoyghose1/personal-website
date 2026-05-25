import Camera from '../components/camera/Camera';

export default function PhotographyPage({ isDark }) {
  return (
    <div className="min-h-screen w-full">
      <Camera isDark={isDark} immersive />
    </div>
  );
}
