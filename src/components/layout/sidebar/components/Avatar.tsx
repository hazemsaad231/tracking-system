const Avatar = ({ name }: { name?: string }) => (
  <div
    className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-violet-400 to-blue-500
      flex items-center justify-center text-white font-bold text-[13px]"
    style={{ boxShadow: '0 3px 10px rgba(139,92,246,.4)' }}
  >
    {name?.charAt(0).toUpperCase() || 'U'}
  </div>
);

export default Avatar;
