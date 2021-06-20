import * as firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
    //各人の認証情報を記述
}

firebase.inisitalizeApp(firebaseConfig)

export default firebase