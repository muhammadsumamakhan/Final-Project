import React from 'react'

const ImageUploading = () => {

  let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dnak9yzfk',
    uploadPreset: 'exp-hack'
  }, (error, result) => {
    if (!error && result && result.event === "success") {
      console.log('Done! Here is the image info: ', result.info);
    }
  })
  return (
    <>
      <button onClick={()=> myWidget.open()}>Upload image</button>
      <div>App</div>
    </>
  )
}

export default ImageUploading



