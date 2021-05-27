import React from 'react'
import {Button,View,Text,Image,Platform} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class Home extends React.Component{
    state = {
        image:null
    }

    pickimage = async() => {
        try {
            let cam = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!cam.cancelled){
                this.setState({image:cam.data})
                console.log(cam.uri)
                this.uploadimg(cam.uri)
            }
        } catch (error) {
         console.log(error)   
        }
    }

    uploadimg = async(uri) => {
        const data = new FormData()
        let filename = uri.split("/")[uri.split("/").length-1]
        let type = `image/${uri.split(".")[uri.split(".").length-1]}`
        const filetoupload = {uri:uri,name:filename,type:type}
        data.append("digit",filetoupload)
        fetch("https://149948d588a4.ngrok.io",{method:"POST",body:data,headers:{"content-type":"multipart/form-data"}}).then(responce=>responce.json())
        .then(result=>console.log("image identified",result)).catch(error=>console.log(error))
    }

    getpermission = async() => {
        if(Platform.OS!=="web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status!=='granted'){
                alert("Camera permission is denied")
            }
        }
    }

    componentDidMount(){
        console.log('hello')
        this.getpermission()
    }

    render(){
        let image = this.state.image
        return(
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Button title="camera" onPress={this.pickimage}/>
            </View>
        )
    }
}