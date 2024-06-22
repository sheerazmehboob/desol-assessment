import { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { instance } from '@/axios/axios';

const CarSubmissionForm = () => {
    const [model, setModel] = useState('');
    const [price, setPrice] = useState(0);
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [maxPictures, setMaxPictures] = useState(1);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    // Ref for Toast component
    const toast = useRef(null);

    const handleImageUpload = (event) => {
        const selectedFiles = event.files.slice(0, maxPictures);
        const newImages = [...images];
        const newPreviews = [...previewImages];
    
        // Append new selected files to the existing arrays
        selectedFiles.forEach((file) => {
            newImages.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });
    
        // Limit the number of images and previews based on maxPictures
        setImages(newImages.slice(0, maxPictures));
        setPreviewImages(newPreviews.slice(0, maxPictures));
    };
    

    const handleDeleteImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...previewImages];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setImages(newImages);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate phone number
        if (!validatePhoneNumber(phone)) {
            showError('Phone number must be 11 digits.');
            return;
        }

        const formData = new FormData();
        formData.append('model', model);
        formData.append('price', price);
        formData.append('phone', phone);
        formData.append('city', city);
        images.forEach((file) => formData.append('images', file));
    
        console.log(formData);
    
        try {
            const token = localStorage.getItem('token');
            const res = await instance.post('/api/cars/', formData, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log(res);
    
            if (res.status === 200) {
                showSuccess('Car submitted successfully!');
            } else {
                showError(res.data.errors ? res.data.errors[0].msg : 'Submission failed.');
            }
        } catch (error) {
            console.error('Car submission failed:', error);
            showError('Car submission failed. Please try again.');
        }
    };
    

    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 5000 });
    };

    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 5000 });
    };

    const validatePhoneNumber = (phoneNumber) => {
        return /^\d{11}$/.test(phoneNumber);
    };

    const maxPicturesOptions = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
    ];

    return (
        <div className="max-w-3xl my-5 mx-auto p-6 bg-white shadow-xl rounded-lg">
            <Toast ref={toast} position="top-right" className="custom-toast" />
            <h2 className="text-3xl font-bold mb-6 text-center">Car Submission Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Car Model</label>
                        <InputText id="model" value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 outlined-input" />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <InputNumber id="price" value={price} onValueChange={(e) => setPrice(e.value)} mode="currency" currency="USD" locale="en-US" className="mt-1 outlined-input" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <InputText id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 outlined-input" />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                        <InputText id="city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 outlined-input" />
                    </div>
                </div>
                <div>
                    <label htmlFor="maxPictures" className="block text-sm font-medium text-gray-700">Max Number of Pictures</label>
                    <Dropdown id="maxPictures" value={maxPictures} options={maxPicturesOptions} onChange={(e) => setMaxPictures(e.value)} placeholder="Select Max Pictures" className="mt-1 outlined-input" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Pictures</label>
                    <FileUpload
                        mode="basic"
                        accept="image/*"
                        maxFileSize={1000000} // 1MB
                        multiple
                        chooseLabel="Choose"
                        uploadLabel="Upload"
                        cancelLabel="Cancel"
                        onSelect={handleImageUpload}
                        className="mt-2"
                    />
                </div>
                {previewImages.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Preview</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                            {previewImages.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img src={preview} alt={`Preview ${index}`} className="w-full h-auto rounded-lg" />
                                    <button type="button" onClick={() => handleDeleteImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-md">
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="text-center mt-6">
                    <Button type="submit" label="Submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" />
                </div>
            </form>
        </div>
    );
};

export default CarSubmissionForm;

