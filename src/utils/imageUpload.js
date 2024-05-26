import supabase from './supabase';

const handleImageUpload = async (image) => {
    const date = new Date();
    const timestamp = date.getTime();
    const originalFileName = image.name;
    const fileExtension = originalFileName.split('.').pop();
    const fileNameWithoutExtension = originalFileName.substring(0, originalFileName.length - fileExtension.length - 1);
    const newFileName = `${fileNameWithoutExtension}-${timestamp}.${fileExtension}`;

    const { data, error } = await supabase
        .storage
        .from('presidio')
        .upload(`properties/${newFileName}`, image, {
            cacheControl: '3600',
            upsert: false
        })
    if (error) {
        console.log(error)
        alert(error.message)
    }
    // console.log(data)
    const res = supabase.storage.from('presidio').getPublicUrl(`properties/${newFileName}`)
    const url = res.data.publicUrl
    return url;
    // console.log(url)
}
export default handleImageUpload;