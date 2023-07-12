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
                Authorization: 'Client ID: cd42c4da6b4837b' 
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const imageLink = data.data.link;
                console.log(imageLink);
                setImageUrl(imageLink);
            })
            .catch(error => {
                console.error('Lỗi khi tải lên ảnh:', error);
            });
    };

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    return (
        <div>
            
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleImageUpload}>Tải lên</button>
            {imageUrl && (
                <div>
                    <p>Đường link ảnh:</p>
                    <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
                    <img src='https://i.imgur.com/ckSPILI.jpg' alt='Image' />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
