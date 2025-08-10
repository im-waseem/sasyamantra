interface AuthFormWrapperProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthFormWrapper({ title, children }: AuthFormWrapperProps) {
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        {children}
      </div>
    </div>
  );
}
