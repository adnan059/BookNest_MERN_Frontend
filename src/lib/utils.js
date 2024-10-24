const msPerDay = 1000 * 60 * 60 * 24;

export const dayDifference = (endDate, startDate) => {
  const diffInMs = Math.abs(
    new Date(endDate).getTime() - new Date(startDate).getTime()
  );
  const diffInDays = Math.ceil(diffInMs / msPerDay);

  return diffInDays;
};

export const upload_preset = import.meta.env.VITE_upload_preset;
export const folder = import.meta.env.VITE_folder;
export const cloud_name = import.meta.env.VITE_cloud_name;
export const baseUrl = import.meta.env.VITE_baseUrl;
