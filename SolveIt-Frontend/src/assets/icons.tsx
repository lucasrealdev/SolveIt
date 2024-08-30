import { AntDesign, Ionicons } from "@expo/vector-icons";

export const icons = {
    index: (props)=> <AntDesign name="home" size={26} {...props} />,
    jogar: (props)=> <Ionicons name="game-controller-outline" size={26} {...props} />,
    criar: (props)=> <AntDesign name="pluscircleo" size={26} {...props} />,
    perfil: (props)=> <AntDesign name="user" size={26} {...props} />,
}