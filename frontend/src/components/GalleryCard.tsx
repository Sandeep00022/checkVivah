import React from "react"; // Import React if not already imported

interface File {
  _id: string;
  name: string;
  type: string;
  size: number;
  fileUrl: string;
}

interface GalleryCardProps {
  file: File; // Define prop type for file
}

const GalleryCard: React.FC<GalleryCardProps> = ({ file }) => {
  const fileType = file.type.split("/")[0];
  return (
    <div className="shadow-2xl rounded-xl p-3">
      {fileType === "image" ? (
        <img width={300} height={300} src={file.fileUrl} alt="image" />
      ) : (
        <VideoPlayer videoUrl={file.fileUrl} />
      )}
    </div>
  );
};

export default GalleryCard;

interface VideoPlayerProps {
  videoUrl: string; // Define prop type for videoUrl
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div className="video-player w-[300px] h-[300px]">
      <video controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
