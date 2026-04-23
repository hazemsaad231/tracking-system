const PermissionBadge = ({ permission }: { permission: string }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 whitespace-nowrap">
      {permission}
    </span>
  );
};

export default PermissionBadge;
