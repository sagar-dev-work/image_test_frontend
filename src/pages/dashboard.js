import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingImageId, setUploadingImageId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Progress state
  const [modalImage, setModalImage] = useState(null); // For the modal popup image
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      toastr.error('No token found, please log in again.');
      router.push('/login');
      return;
    }

    // Fetch user details
    api
      .get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        toastr.success('User details loaded successfully!');
      })
      .catch((err) => {
        toastr.error(err.response?.data?.message || 'Error fetching user details');
        console.error('Error fetching user details:', err);
      });

    // Fetch images
    api
      .get('/user-images', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setImages(response.data);
        toastr.success('Images fetched successfully!');
      })
      .catch((err) => {
        toastr.error(err.response?.data?.message || 'Error fetching user images');
        console.error('Error fetching user images:', err);
      });
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toastr.warning('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    const token = localStorage.getItem('token');
    if (!token) {
      toastr.error('No token found. Please log in again.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    api
      .post('/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress); // Update progress bar
        },
      })
      .then((response) => {
        toastr.success('Image uploaded successfully!');
        setUploadingImageId(response.data.image_id);
        checkImageProcessingStatus(response.data.image_id);
        setIsUploading(false);
        setUploadProgress(0);

        // Clear the file input and reset selectedFile
        setSelectedFile(null);
        event.target.reset();
      })
      .catch((err) => {
        setIsUploading(false);
        setUploadProgress(0);
        toastr.error(err.response?.data?.message || 'Error uploading image');
        console.error('Error uploading image:', err);
      });
  };

  const checkImageProcessingStatus = (imageId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toastr.error('No token found. Please log in again.');
      return;
    }

    const intervalId = setInterval(() => {
      api
        .get(`/image-status/${imageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.status === 'completed') {
            clearInterval(intervalId); // Stop polling
            toastr.success('Image processing completed!');

            const imageUrl = response.data.generated_images.replace(/\\/g, '');

            const newImage = { url: imageUrl };
            if (!images.some((existingImage) => existingImage.url === newImage.url)) {
              setImages((prevImages) => [...prevImages, newImage]);
            }

            setUploadingImageId(null);
          }
        })
        .catch((err) => {
          toastr.error('Error checking image status');
          console.error('Error checking image status:', err);
        });
    }, 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setImages([]);
    toastr.success('Logged out successfully!');
    window.location.href = '/login';
  };

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1>Welcome, {user.name}!</h1>
          <p className='email-text'>Email: {user.email}</p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleFileUpload} className='upload-form'>
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit" className="upload-img-btn">Upload Image</button>
        </div>

      </form>

      {isUploading && (
        <div className="upload-popup">
          <div className="upload-header">
            <h3>Uploading Image</h3>
          </div>
          <div className="upload-body">
            <p>Progress: {uploadProgress}%</p>
            <div className="upload-progress-bar">
              <div
                className="upload-progress"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <h2 className="uploaded-images-text">Uploaded Images:</h2>
      {images.length > 0 ? (
        <div className="uploaded-images">
          {images.map((image, index) => (
            <>
              <img
                key={index}
                src={image.url}
                alt={`Uploaded ${index}`}
                onClick={() => openModal(image.url)}
                style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }}
              />
              {/* <button onClick={() => handleDeleteImage(image.id)}>Delete</button> */}
            </>
          ))}
        </div>
      ) : (
        <p>No images uploaded yet.</p>
      )}

      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={modalImage} alt="Modal" />
          </div>
        </div>
      )}

      <style jsx>{`
        .upload-popup {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          width: 300px;
          padding: 15px;
          z-index: 1000;
        }
        .upload-header {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
          text-align: center;
        }
        .upload-body {
          text-align: center;
        }
        .upload-progress-bar {
          background: #e0e0e0;
          border-radius: 5px;
          height: 10px;
          width: 100%;
          margin-top: 10px;
          position: relative;
        }
        .upload-progress {
          background: #4285f4;
          height: 100%;
          border-radius: 5px;
          transition: width 0.4s ease;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 10px;
          border-radius: 8px;
        }
        .modal img {
          max-width: 100%;
          max-height: 100%;
          width: 500px;
          height: 500px;
        }
        .progress-bar-container {
          margin: 20px 0;
          text-align: center;
        }
        .progress-bar {
          background: #e0e0e0;
          border-radius: 5px;
          height: 10px;
          width: 100%;
          position: relative;
        }
        .progress {
          background: #4285f4;
          height: 100%;
          border-radius: 5px;
          transition: width 0.4s ease;
        }
        .upload-form {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .upload-btn {
          background-color: #4caf50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
        .upload-btn:hover {
          background-color: #45a049;
        }
        .email-text, .upload-header, .upload-body {
          color: #000;
        }
        .uploaded-images {
          padding:20px;
        }
        .uploaded-images-text {
          padding:20px;
        }
        .upload-img-btn {
          margin-left:4px;
        }
      `}</style>
    </div>
  );
}
