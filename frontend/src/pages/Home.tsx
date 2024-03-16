import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { app } from "../firebase";
import { Alert, Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import {
  fileUploadFailure,
  fileUploadStart,
  fileUploadSuccess,
} from "../redux/file/fileSlice";
import { CircularProgressbar } from "react-circular-progressbar";
import ShowSizes from "../components/ShowSizes";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type MyEnum = number | null;

const Home = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUplaodProgress] =
    useState<MyEnum>(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null);
  const [videoUploadProgress, setVideoUplaodProgress] = useState<MyEnum>(null);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [UploadedFileSuccess, setUploadedFileSuccess] = useState<string | null>(
    null
  );
  const [UploadedFileError, setUploadedFileError] = useState<string | null>(
    null
  );

  const notify = () => toast("Your file has been uploaded");

  console.log(videoUploading);
  console.log(UploadedFileSuccess);
  const dispatch = useDispatch();

  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const imageFilePickerRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setVideoFile(file);
      setVideoFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    setImageUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);

    if (imageFile) {
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUplaodProgress(
            progress !== null ? Number(progress.toFixed(0)) : null
          );
        },
        (error) => {
          setImageFileUploadError(
            "Could not upload image (File must be less than 20MB)"
          );
          setImageFileUplaodProgress(null);
          setImageFile(null);
          setImageFileUrl(null);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);

            setImageUploading(false);
          });
        }
      );
    }
  };

  const uploadVideo = async () => {
    setVideoUploading(true);
    setVideoUploadError(null);
    const storage = getStorage(app);
    if (videoFile) {
      const fileName = new Date().getTime() + videoFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, videoFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setVideoUplaodProgress(Number(progress.toFixed(0)));
        },
        (error) => {
          setVideoUploadError(
            "Could not upload video (File must be less than 20MB)"
          );
          console.log(error);
          setVideoUploadError(null);
          setVideoFile(null);
          setVideoFileUrl(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setVideoFileUrl(downloadURL);

            setVideoUploading(false);
          });
        }
      );
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  useEffect(() => {
    if (videoFile) {
      uploadVideo();
    }
  }, [videoFile]);

  const handleUploadFile = async () => {
    setUploadedFileError(null);
    setUploadedFileSuccess(null);
    let payload;

    if (imageFile) {
      payload = {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
        fileUrl: imageFileUrl,
      };
    }
    if (videoFile) {
      payload = {
        name: videoFile.name,
        size: videoFile.size,
        type: videoFile.type,
        fileUrl: videoFileUrl,
      };
    }

    if (imageUploading) {
      setUploadedFileError("Please wait for file to upload");
      return;
    }

    try {
      setLoading(true);
      dispatch(fileUploadStart());
      const res = await fetch(`/api/file/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(fileUploadFailure(data.message));
        setUploadedFileError(data.message);
      } else {
        dispatch(fileUploadSuccess(data.data));
        setUploadedFileSuccess("Uploaded file successfully");
        notify();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen  justify-center  items-center">
      <ShowSizes />
      <div className="flex flex-col  justify-center items-center">
        <div className="flex mb-6 gap-7 justify-center w-full items-center">
          <div>
            <input
              onChange={handleImageChange}
              ref={imageFilePickerRef}
              hidden
              accept="image/*"
              type="file"
            />
            <Button
              gradientDuoTone={"pinkToOrange"}
              className="relative shadow-xl w-32 h-32 self-center flex justify-center items-center border border-4  cursor-pointer 
           overflow-hidden rounded-full"
              onClick={() => imageFilePickerRef.current?.click()}
            >
              {imageFileUploadProgress && (
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  text={`${imageFileUploadProgress}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    },
                    path: {
                      stroke: `rgba(62, 152, 199, ${
                        imageFileUploadProgress / 100
                      } )`,
                    },
                    text: {
                      fill: "white",
                    },
                  }}
                />
              )}
              {!imageFileUploadProgress && (
                <h1 className="font-bold ">Upload Image</h1>
              )}
            </Button>
          </div>
          <div>
            <input
              onChange={handleVideoChange}
              ref={filePickerRef}
              hidden
              accept="video/*"
              type="file"
            />
            <Button
              gradientDuoTone={"purpleToBlue"}
              className="relative shadow-xl w-32 h-32 self-center flex justify-center items-center border border-4  cursor-pointer 
              overflow-hidden rounded-full"
              onClick={() => filePickerRef.current?.click()}
            >
              {videoUploadProgress && (
                <CircularProgressbar
                  value={videoUploadProgress || 0}
                  text={`${videoUploadProgress}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      textDecorationColor: "white",
                      top: 0,
                      left: 0,
                    },
                    path: {
                      stroke: `rgba(62, 152, 199, ${
                        videoUploadProgress / 100
                      } )`,
                    },
                    text: {
                      fill: "white",
                    },
                  }}
                  className="text-white"
                />
              )}
              {!videoUploadProgress && (
                <h1 className="font-bold ">Upload Video</h1>
              )}
            </Button>
          </div>
        </div>
        <Button
          className="w-full"
          gradientDuoTone={"purpleToPink"}
          onClick={handleUploadFile}
        >
          {loading ? "Adding to Gallery..." : "Add To Your Gallery"}
        </Button>
        {UploadedFileError && (
          <Alert color={"failure"} className="mt-6">
            {UploadedFileError}
          </Alert>
        )}
        {videoUploadError && (
          <Alert color={"failure"} className="mt-6">
            {videoUploadError}
          </Alert>
        )}
        {imageFileUploadError && (
          <Alert color={"failure"} className="mt-6">
            {imageFileUploadError}
          </Alert>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
