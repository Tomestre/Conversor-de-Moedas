import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styles from './style.js';
import {Picker} from '@react-native-picker/picker';
import api from './src/services/api.js';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);

  let [moedaSelecionada, setMoedaSelecionada] = useState(null);

  //Request array das moedas
  useEffect(() => {
    async function loadingMoedas() {
      const response = await api.get('all');

      let arrayMoedas = [];
      Object.keys(response.data).map((key, index) => {
        arrayMoedas.push(<Picker.Item value={index} label={key} />);
      });

      setMoedas(arrayMoedas);
      setLoading(false);
    }
    loadingMoedas();
  }, []);
  //loading
  if (loading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator color={'#FFF'} size={45} />
      </View>
    );
  } else {
    //Layout
    return (
      <View style={styles.container}>
        <View style={styles.areaMoeda}>
          <Text style={styles.moeda}>Selecione uma Moeda</Text>
          <Picker
            selectedValue={moedaSelecionada}
            onValueChange={(moeda, index) => setMoedaSelecionada(moeda)}>
            {moedas}
          </Picker>

          <View style={styles.areaValor}>
            <Text style={styles.moeda}>
              Digite um valor para converter em moeda
            </Text>
            <TextInput
              style={styles.input}
              placeholder="EX: 150"
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.botaoArea}>
          <Text style={styles.botaoTexto}>Converter</Text>
        </TouchableOpacity>

        <View style={styles.areaResultado}>
          <Text style={styles.valorConvertido}>3 USD</Text>
          <Text style={([styles.valorConvertido], {fontSize: 18, margin: 10})}>
            Corresponde a
          </Text>
          <Text style={styles.valorConvertido}>1,90</Text>
        </View>
      </View>
    );
  }
}
