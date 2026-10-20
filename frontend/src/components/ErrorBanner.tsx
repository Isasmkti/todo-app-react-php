type Props = {
  message: string;
  onClose: () => void;
};

export default function ErrorBanner({ message, onClose }: Props) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      {message}
      <button type="button" className="text-button" onClick={onClose}>
        Tutup
      </button>
    </div>
  );
}
