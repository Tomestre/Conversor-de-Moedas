import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import styles from './style.js';
import {Picker} from '@react-native-picker/picker';
import api from './src/services/api.js';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function App() {
  //Escopo Global
  const [itemMoedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nomeMoeda, setNomeMoeda] = useState([]);

  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [valorInput, setValorInput] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);

  //Request array das Moedas
  useEffect(() => {
    async function loadingMoedas() {
      const response = await api.get('all');

      let arrayItemMoedas = [];
      const arrayMoeda = Object.keys(response.data);
      //aqui é feito o Item para o Picker
      arrayMoeda.map((key, index) => {
        arrayItemMoedas.push(
          <Picker.Item value={index} label={key} key={index} />,
        );
      });

      setMoedas(arrayItemMoedas);
      setLoading(false);
      setNomeMoeda(arrayMoeda);
    }
    loadingMoedas();
  }, []);

  //Request onde busca o preço da moeda na API
  async function converterMoeda() {
    if (valorInput == 0 || moedaSelecionada == null) {
      alert('Por Favor selecione uma moeda ou digite um valor');
      return;
    }
    const response = await api.get(`all/${nomeMoeda[moedaSelecionada]}-BRL`);

    let resultado =
      response.data[nomeMoeda[moedaSelecionada]].ask * parseFloat(valorInput);

    setValorConvertido(resultado.toFixed(2));
    Keyboard.dismiss();
  }

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
            selectedValue={moedaSelecionada == null ? '' : moedaSelecionada}
            onValueChange={moeda => {
              setMoedaSelecionada(moeda);
              setValorConvertido(0);
            }}>
            {itemMoedas}
          </Picker>

          <View style={styles.areaValor}>
            <Text style={styles.moeda}>
              Digite um valor para converter em moeda
            </Text>
            <TextInput
              style={styles.input}
              placeholder="EX: 150"
              keyboardType="numeric"
              onChangeText={valor => setValorInput(valor)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.botaoArea}
          onPress={() => converterMoeda()}>
          <Text style={styles.botaoTexto}>Converter</Text>
        </TouchableOpacity>

        {valorConvertido !== 0 && (
          <View style={styles.areaResultado}>
            <Text
              style={
                styles.valorConvertido
              }>{`${valorInput} ${nomeMoeda[moedaSelecionada]}`}</Text>
            <Text
              style={([styles.valorConvertido], {fontSize: 18, margin: 10})}>
              Corresponde a
            </Text>
            <Text
              style={styles.valorConvertido}>{`R$ ${valorConvertido}`}</Text>
          </View>
        )}
      </View>
    );
  }
}
