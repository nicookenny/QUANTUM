//general
import React, { useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, 
        TextInput, ProgressBarAndroid, Button, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { stepOne } from '../redux/actions/register';
import colors from "./style/colors";
import s from "./style/styleSheet"

import { Link } from 'react-router-native';
import { LinearGradient } from 'expo-linear-gradient';


function RegisterConfirmation(props){

    const { stepOne, navigation } = props;

    const [date, setDate] = useState(new Date(null));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    };

    const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
    };

    const showDatepicker = () => {
    showMode('date');
    };
    
    const [name, onChangeName] = useState(null);
    const [surname, onChangeSurname] = useState(null);

    const [error, setError] = useState("");
    const mostrarError = (err) => {
      setError(err);
      setTimeout(() => {
        setError("");
      }, 3000);
    };

    function next () {
        if(name === null || surname === null || date === null ){
            return mostrarError('Debe ingresar todos los datos')}
        if(name.length < 2 || surname.length < 2 ){
            return mostrarError('Los datos no son validos')}
        const payload = {
            birthdate: `${date}`,
            name: name, 
            surname: surname,
            
        }

        stepOne(payload)
        navigation.navigate("RegisterStepTwo");
    }


    return (
        
        <View style={s.container}>
            <LinearGradient
                // Background Linear Gradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 300,
                }}
            />

            <ScrollView>
                <View style={{ ...s.mb(5)}}>
                    <Link to="/" component={TouchableOpacity}>
                        <Text style={s.textColor('orange')}> &times; Salir</Text>
                    </Link>
                </View>
                

                
                <Text style={{ fontSize:20, justifyContent:'center', color:'#EBEBEB',
                    paddingVertical: 8}}>
                    Completá tus datos
                </Text>

                <View style={s.bg('rgba(0,0,0, .2)')}>
                    <View opacity={0.8} style={{ ...s.col(4),...s.hr('orange', 4) }} />
                </View>
                
            

                <View style={s.mt(5)}>

                    <Text style={styles.text}>Nombre</Text>
                    
                    
                    <TextInput
                    placeholder='Nombre'
                    style={s.input}
                    value={name}
                    onChangeText={(text) => onChangeName(text)}
                    


                    />

                    <Text style={styles.text}>Apellido</Text>

                    <TextInput
                    placeholder='Apellido'
                    style={s.input}
                    onChangeText={(text) => onChangeSurname(text)}

                    />

                    <Text style={styles.text}>Fecha nacimiento</Text>

            <View>
                <View style={s.input}>
                    <TouchableOpacity onPress={showDatepicker}>
                            <Text style={styles.date}>{date.toDateString()}</Text>                 
                    </TouchableOpacity>
                </View>
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    minimumDate={new Date(1950, 0, 1)}
                    maximumDate={new Date(2003, 12, 31)} 
                    />
                )}

                <View style={s.mt(5)}>
                    <TouchableOpacity style={{ ...s.btn(), ...s.mb(10)}} onPress={() => next(name)} >          
                            <Text style={{ ...s.textButton() }}>Siguiente</Text>              
                    </TouchableOpacity>
                </View>
            </View>    
            {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

            </View>
            
            
            </ScrollView>
            

        </View>
   
    );
}

const styles = StyleSheet.create({

      errorMessage: {
        color: colors.pink,
        alignSelf: "center",
        padding: 10,
      },
      button: {
            backgroundColor: '#E94560',
            borderRadius: 7,
            width: 150
      },
      form: {
            alignContent:'center',
            justifyContent: 'center',
            width: '90%',
      },
      text: { 
        fontSize:20, 
        color:'#EBEBEB', 
        paddingTop:10
      },
      date: {
          textAlign:'center',
          color: 'gray',
      }
});

function mapStateToProps(state) {
    return {
        
    }
}

function mapDispatchToProps(dispatch) {
    return {
        stepOne: payload => dispatch(stepOne(payload)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)
(RegisterConfirmation);