import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { usePageTitleContext } from '../contexts/PageTitleContext'
import supabase from '../../helper/supabaseClient'
import { useSessionContext } from '../contexts/SessionContext'
import { Button, Card, CardMedia, styled } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

function Profile() {
  const [username, setUsername] = useState<string | null>("")
  const [name, setName] = useState<string | null>("")
  const [profileUrl, setProfileUrl] = useState<string | null>("")
  const [message, setMessage] = useState("")
  const [img, setImg] = useState("")
  const { session } = useSessionContext()

  const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('Users')
      .update({ name: username })
      .eq('user_id', session!.user.id)
      .select()

    if (data) {
      setMessage(username + " set as username")
      setName(username)
    } else {
      setMessage("error")
      console.log(error)
    }
  }

  const updateImage = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Updating image")

    if (!e.target.files || e.target.files.length === 0) {
      setMessage('You must select an image to upload.')
      return
    }

    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    console.log("File", file.name, file.size, file.type)
    const { error } = await supabase.storage.from('profile-images').upload(fileName, file)
    if (error) {
      alert("upload error")
      console.log(error.message)
      return
    } else {

      console.log("uploaded img")

      await supabase.from('Users')
        .update({ image_file: fileName })
        .eq("user_id", session!.user.id)
        .then(res => console.log(res.error))
    }
  }


  useEffect(() => {
    console.log(session?.user.email)
    if (session?.user) {
      const fetchUser = async () => {
        const { data, error } = await supabase
          .from('Users')
          .select()
          .eq('user_id', session!.user.id)
          .single()

        setName(data!.name)
        console.log(data!.name)
        setProfileUrl(data!.image_file)
      }

      fetchUser()
    }
  }, [session])

  useEffect(() => {
    const downloadImage = async () => {
      const { data, error } = await supabase
        .storage
        .from('profile-images')
        .download(profileUrl!)
      if (error) {
        console.error('Error downloading image:', error.message)
      } else {
        const url = URL.createObjectURL(data)
        setImg(url)
      }
    }

    downloadImage()

  }, [profileUrl])


  //Set header title to Login
  const { title, setTitle } = usePageTitleContext();

  useEffect(() => {
    console.log("Setting title to Profile")
    setTitle("Profile");
    console.log(title)
  }, [])
  //

  return (
    <>
      <h1>{name}</h1>
      <Card sx={{ width: 'max(25%,200px)' }}><CardMedia sx={{ height: '200px' }} image={img} /></Card>
      <form onSubmit={updateProfile} >
        <input type="text" placeholder="Your username" value={username!} onChange={e => setUsername(e.target.value)} />
        <button type="submit">Submit</button>
        <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
          Upload File
          <VisuallyHiddenInput type='file' onChange={(e) => updateImage(e)} />

        </Button>

      </form>
      <div>{message}</div>



    </>
  )
}

export default Profile