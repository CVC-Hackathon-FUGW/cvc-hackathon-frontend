import { Button } from '@mantine/core';
import { useState } from 'react';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null as any);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('image', selectedImage);

    fetch('https://api.imgur.com/3/upload', {
      method: 'POST',
      headers: {
        Authorization: 'Client ID: cd42c4da6b4837b',
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const imageLink = data.data.link;
        setImageUrl(imageLink);
      })
      .catch((error) => {
        console.error('Lỗi khi tải lên ảnh:', error);
      });
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  return (
    <div>
      <div className="">
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div className="flex">
        <Button className="mt-2" onClick={handleImageUpload}>
          Tải lên
        </Button>
        {imageUrl && (
          <div className="ml-2 mt-2">
            <img src={imageUrl} width={200} alt="Image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
