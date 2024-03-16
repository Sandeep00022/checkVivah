import { Button } from "flowbite-react";

import { useSelector } from "react-redux";
import { rootReducer } from "../redux/store";

type RootState = ReturnType<typeof rootReducer>;
const ShowSizes = () => {
  const { files } = useSelector((state: RootState) => state.file);

  let totalSize = 0;
  let totalImageSize = 0;
  let totalVideoSize = 0;

  if (files && files.length > 0) {
    totalSize = files.reduce((totalSize, file) => totalSize + file.size, 0);
    totalImageSize = files
      .filter((file) => file.type.split("/")[0].toString() === "image")
      .reduce((totalSize, file) => totalSize + file.size, 0);

    totalVideoSize = files
      .filter((file) => file.type.split("/")[0].toString() === "video")
      .reduce((totalSize, file) => totalSize + file.size, 0);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) {
      return bytes + " bytes";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 justify-center mb-9">
        <Button gradientDuoTone={"purpleToPink"} outline>
          Total Size: {formatFileSize(totalSize)}
        </Button>
        <Button gradientDuoTone={"purpleToPink"} outline>
          Total Image Size: {formatFileSize(totalImageSize)}
        </Button>
        <Button gradientDuoTone={"purpleToPink"} outline>
          Total Video Size: {formatFileSize(totalVideoSize)}
        </Button>
      </div>
    </div>
  );
};

export default ShowSizes;
