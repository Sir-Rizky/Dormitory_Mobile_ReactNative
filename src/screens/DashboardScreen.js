import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MENU_CONFIG = {
  penghuni: [
    { key: 'kelola', label: 'Kelola Kamar', icon: require('../../assets/absen.png') },
    { key: 'detail', label: 'Detail Kamar', icon: require('../../assets/absen.png') },
    { key: 'penghuni', label: 'Penghuni', icon: require('../../assets/absen.png') },
    { key: 'checkout', label: 'Checkout', icon: require('../../assets/absen.png') },
    { key: 'izin', label: 'Izin Berpulang', icon: require('../../assets/absen.png') },
    { key: 'absen', label: 'Absen Malam', icon: require('../../assets/absen.png') },
  ],
  admin: [
    { key: 'kelola', label: 'Kelola Kamar', icon: require('../../assets/absen.png') },
    { key: 'detail', label: 'Detail Kamar', icon: require('../../assets/absen.png') },
    { key: 'penghuni', label: 'Penghuni', icon: require('../../assets/absen.png') },
    { key: 'checkout', label: 'Checkout', icon: require('../../assets/absen.png') },
    { key: 'izin', label: 'Izin Berpulang', icon: require('../../assets/absen.png') },
    { key: 'absen', label: 'Absen Malam', icon: require('../../assets/absen.png') },
  ],
  kemahasiswaan: [
    { key: 'kelola', label: 'Kelola Kamar', icon: require('../../assets/absen.png') },
    { key: 'detail', label: 'Detail Kamar', icon: require('../../assets/absen.png') },
    { key: 'penghuni', label: 'Penghuni', icon: require('../../assets/absen.png') },
    { key: 'checkout', label: 'Checkout', icon: require('../../assets/absen.png') },
    { key: 'izin', label: 'Izin Berpulang', icon: require('../../assets/absen.png') },
    { key: 'absen', label: 'Absen Malam', icon: require('../../assets/absen.png') },
  ],
};

const DashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const mode = route.params?.mode || 'penghuni';
  const name = route.params?.name || 'Namamu';
  const menu = MENU_CONFIG[mode];

  const handleLogout = () => {
    // Implement your logout logic here
    navigation.replace('Login', { mode });
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        if (item.key === 'absen') {
          navigation.navigate('AbsenMalam');
        }
        // ...tambahkan navigasi lain jika perlu
      }}
    >
      <Image source={item.icon} style={styles.menuIcon} />
      <Text style={styles.menuLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/absen.png')} style={styles.avatar} />
        <Text style={styles.headerText}>Hai, "{name}"</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {/* Title */}
      <Text style={styles.sectionTitle}>Informasi Aktivitas</Text>
      {/* Menu Grid */}
      <FlatList
        data={menu}
        renderItem={renderMenuItem}
        keyExtractor={item => item.key}
        numColumns={3}
        contentContainerStyle={styles.menuGrid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#294066',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    // borderBottomLeftRadius: 16,
    // borderBottomRightRadius: 0,
    marginTop: 30,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  logoutText: {
    color: '#294066',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#294066',
    marginTop: 10,
    marginLeft: 16,
    marginBottom: 8,
  },
  menuGrid: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    padding: 16,
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    minWidth: (width - 64) / 3,
    maxWidth: (width - 64) / 3,
    elevation: 2,
  },
  menuIcon: {
    width: 36,
    height: 36,
    marginBottom: 8,
    tintColor: '#294066',
  },
  menuLabel: {
    fontSize: 13,
    color: '#294066',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default DashboardScreen; 