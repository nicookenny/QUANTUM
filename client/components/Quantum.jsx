import React,{useState, useEffect} from 'react';
import {
    TouchableOpacity,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Image,
    View,
    ScrollView,
    StatusBar as statusBar,
    Dimensions,
    useColorScheme
} from 'react-native';
import useBootnative from 'bootnative';
import s from './style/styleSheet';
import { StatusBar } from 'expo-status-bar';


export const bn = useBootnative(); //este si
export const bootnative = useBootnative; //este no

const defaultColors = {
    primary: "#E94560",
    secondary: "#6C757D",
    success: "#51A846",
    danger: "#DD4145",
    waring: "#FBC230",
    info: "#3DA3B9",
    light: "#F8F9FA",
    dark: "#343A40",
    white: "#ffffff",
 
    blue: "#057AFC",
    indigo: "#7066F2",
    purple: "#7152C1",
    pink: "#E9548C",
    red: "#DD4145",
    orange: "#F37D30",
    yellow: "#FBC230",
    green: "#51A846",
    teal: "#5CCA98",
    cyan: "#3DA3B9",
}

const darkColors= {
    body: defaultColors.dark,
    label: "rgba(255,255,255, .7)",
    labelErrorBg: "rgba(221, 65, 69, .2)",
    labelError:defaultColors.danger,
    link: "rgba(255,255,255, .5)",

    light2: "rgba(255,255,255, .1)",
    light3: "rgba(255,255,255, .5)",
    inputBg: "#3d4954",
    inputBorder: "rgba(0,0,0, .1)",
    inputBorderFocus: "rgba(255,255,255, .7)",
    inputColor: "rgba(255,255,255, .7)"
}

const lightColors={
    body: defaultColors.light,
    label: defaultColors.dark,
    labelErrorBg: "rgba(221, 65, 69, .2)",
    labelError:defaultColors.danger,
    link: defaultColors.primary,

    light2: "#f1f1f1",
    light3: "#999",
    inputBg: "#fff",
    inputBorder: '#999',
    inputColor: "#222",
    inputBorderFocus: defaultColors.primary
}

let bnDark = useBootnative({colors:{...defaultColors,...darkColors}});
let bnLight = useBootnative({colors:{...defaultColors,...lightColors}});

export const hbn = (styles = '',darkMode = 'light') => {
    if(darkMode === 'dark'){
        return bnDark(styles);
    }
    return bnLight(styles);
}


export function Container({children, styles}){
    const colorScheme = useColorScheme();
    
    return (
        <ScrollView>
            <View style={{ ...hbn('container p-3 bg-body',colorScheme),height:(Dimensions.get('window').height + statusBar.currentHeight), justifyContent:'center',...styles}}>
                {children}
                <StatusBar style="auto" />
            </View>
        </ScrollView>
    );
}

export function Label(props){
    const theme = useColorScheme();

    return <Text {...props} style={{ ...hbn('text-label mb-1',theme),...(props.type==='error' ? hbn('borderRadius-5 p-2 bg-labelErrorBg text-labelError',theme):{}),...s.size(4),...props.style }}>{props.text}</Text>
}

export function Alert({variant, content, style, textStyle}){
    const theme = useColorScheme();
    return (
        <View style={bn('row')}>
            <View style={{ ...hbn('col-12 p-3 bg-'+(variant||'light2')+' borderRadius-5 mt-5',theme),...style }}>
                <Text style={{ ...hbn('text-center text-light3',theme),...s.size(3.5),...textStyle }}>{content}</Text>
            </View>
        </View>
    );
}

export function Logo({size, style}){
    const styles = {
        lg:{
            height:160,
            width:160
        },
        sm: {
            height:100,
            width: 100,
        },
        xs: {
            height:32,
            width:32
        }
    }
    return (
        <Image source={require("../logo.png")} style={{ ...styles[size||'sm'], alignSelf: "center",...style }}></Image>
    );
};

function DefaultButton({label, color, onPress, style, textStyle, editable, outline}){
    const colorScheme = useColorScheme();

    const defaultStyles = {
        ...hbn((outline ? 'border-1-primary-solid ' : '') + 'borderRadius-5 p-3.5 bg-'+(color || 'primary'), colorScheme)
    }


    return (
        <TouchableOpacity
            editable={editable}
            style={{ ...defaultStyles,...style }}
            onPress={onPress}
        >
            <Text style={{ ...hbn('bold text-'+(outline ? outline : 'white')+' text-center',colorScheme),textTransform:'uppercase',...textStyle }}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export function Button(props){
    const {to, navigation, params} = props;
    if(to && navigation)
        return <DefaultButton {...props} onPress={()=>navigation.navigate(to, params||{})} />
    return <DefaultButton {...props} />
}

export function QTLink({to,navigation, label, style}){
    const theme = useColorScheme();
    return (
        <TouchableOpacity onPress={() => navigation.navigate(to)}>
            <Text style={{ ...hbn('text-link text-center',theme),textDecorationLine:'underline',...style }}>{label}</Text>
        </TouchableOpacity>
    );
}

export function Input({placeholder, style,secureTextEntry, onFocus ,onChangeText, value,onIconRightPress, autoCapitalize, editable, keyboardType, onBlur, iconRight = null}){
    const theme = useColorScheme();

    const [focused, setFocused] = useState(false);
    
    const focusStyles ={
        shadowOffset:{  width: 0,  height: 0,  },
        shadowOpacity: 1.0,
        elevation:15
    }
    
    const onBlurDefault = cb => {
        return () => {
            setFocused(false);
            if(typeof cb === 'function') cb();
        }
    }

    const onFocusDefault = cb => {
        return () => {
            setFocused(true);
            if(typeof cb === 'function') cb();
        }
    }

    
    return (
        <View>
            <TextInput
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                style={{
                        ...hbn('p-3 border-1-inputBorder-solid-5 bg-inputBg text-inputColor', theme),
                        ...(focused ? {...hbn('borderColor-inputBorderFocus bg-inputBg',theme),...focusStyles} :{}),
                        ...iconRight ? {paddingRight:45} : {},
                        ...s.size(3.5),
                        ...style
                    }}
                selectionColor={theme === 'dark' ? 'rgba(255,255,255,.2)' : defaultColors.primary}
                placeholderTextColor={theme === 'dark' ? darkColors.light2 : "#d9d9d9"}
                onBlur={onBlurDefault(onBlur)}
                onFocus={onFocusDefault(onFocus)}
                onChangeText={onChangeText}
                value={value}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                editable={editable} 
            />
            {iconRight && <TouchableOpacity style={{ ...bn('p-2 py-4'),position:'absolute', right:0, top:0,elevation:20 }} onPress={onIconRightPress}>
                    <Image
                        style={{ ...bn('width-20'), height:20 }}
                        source={iconRight}
                    />
                </TouchableOpacity>}
        </View>
    );
}