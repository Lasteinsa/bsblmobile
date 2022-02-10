import axios            from 'axios';
import { createStore }  from 'vuex'
import { TokenService } from "@/services/token.service";
import router           from "@/router";

export default createStore({
  state() {
    return {
      BASEAPI  : "https://bsbl.herokuapp.com",
      APIURL   : "https://t-gadgetcors.herokuapp.com/https://bsbl.herokuapp.com",
      linkAdmin: "https://wa.me/6281287200602?text=Hallo%20Admin,%20saya%20ada%20kendala%20mengenai%20password",
      dataSaldo : "",
      dataNasabah : "",
      dataArticles : "",
      dataJenisSampah: "",
      dataSampahMasuk: "",
      showForgotPass : false,
      dataHistoryTrans: "",
      showFilterTransaksi: false,
      currentDashboardTab : "saldo saya",
      dataAlert: {
        show   : false,
        type   : '',
        message: '',
      },
      dataLogin: {
        username_or_email: '',
        password: ''
      },
      showLoading: {
        show: false,
        text: 'tex'
      },
      dataDetilSampahMasuk: {
        show     : false,
        kategori : '',
      },
      historyTransDate: {
        start: "",
        end: "",
      }
    }
  },
  mutations: {
    setDataAlert: function(state: any, value) {
      state.dataAlert.show    = value.show;
      state.dataAlert.type    = value.type;
      state.dataAlert.message = value.message;
    },
    setDataLogin: function(state: any, value) {
      state.dataLogin.username_or_email = value.username_or_email;
      state.dataLogin.password = value.password;
    },
    setShowLoading: function(state: any, value) {
      state.showLoading.show = value.show;
      state.showLoading.text = value.text;
    },
    setShowForgotPass: function(state: any, value) {
      state.showForgotPass = value;
    },
    setShowFilterTrans: function(state: any, value) {
      state.showFilterTransaksi = value;
    },
    setDashboardTab: function(state: any, value) {
      state.currentDashboardTab = value;
    },
    setDataSaldo:  function(state: any, value) {
      state.dataSaldo = value;
    }, 
    setDataNasabah:  function(state: any, value) {
      state.dataNasabah = value;
    }, 
    setDataArticles:  function(state: any, value) {
      state.dataArticles = value;
    }, 
    setDataSampahMasuk:  function(state: any, value) {      
      state.dataSampahMasuk = value;
    }, 
    setDataJenisSampah:  function(state: any, value) {      
      state.dataJenisSampah = value;
    }, 
    setHistoryTransDate:  function(state: any, value) {      
      state.historyTransDate.start = value.start;
      state.historyTransDate.end   = value.end;
    }, 
    setDataHistoryTrans:  function(state: any, value) {      
      state.dataHistoryTrans = value;
    }, 
    setDetilSampahMasuk: function(state: any, value) {
      state.dataDetilSampahMasuk.show     = value.show;
      state.dataDetilSampahMasuk.kategori = value.kategori;
    },
  },
  actions: {
    getProfileNasabah: function ({ commit },refresher = "") {
      axios.get(`${this.state.APIURL}/nasabah/getprofile`,{
        headers: {
            token: TokenService.getToken()!
          }
      })
      .then(response => {
        if (refresher) {
          refresher.complete();
        }

        commit("setDataNasabah",response.data.data);
      })
      .catch(error => {
        if (refresher) {
          refresher.complete();
        }

        // Unauthorize
        if (error.response.status == 401) {
          if (error.response.data.messages == 'token expired') {
            commit("setDataAlert",{
              show   :true,
              type   :'warning',
              message:'waktu login sudah habis, silahkan login ulang'}
            );
          }

          commit("setDataNasabah","");
          commit("setDataArticles","");
          TokenService.removeToken()!;
          router.push("/login");
        }

      })
    },
    getSaldo: function ({ commit }) {
      axios.get(`${this.state.APIURL}/transaksi/getsaldo`,{
        headers: {
            token: TokenService.getToken()!
          }
      })
      .then(response => {
        commit("setDataSaldo",response.data.data);
      })
      .catch(error => {
        
      })
    },
    getSampahMasuk: function ({ commit }) {
      axios.get(`${this.state.APIURL}/transaksi/sampahmasuk`,{
        headers: {
            token: TokenService.getToken()!
          }
      })
      .then(response => {
        commit("setDataSampahMasuk",response.data.data);
      })
      .catch(error => {
        
      })
    },
    getJenisSampah: function ({ commit }) {
      axios.get(`${this.state.APIURL}/sampah/getsampah`)
      .then(response => {
        commit("setDataJenisSampah",response.data.data);
      })
      .catch(error => {
        
      })
    },
    getArticles: function ({ commit },refresher = "") {
      axios.get(`${this.state.APIURL}/artikel/getartikel?orderby=terbaru&limit=5`)
      .then(response => {
        if (refresher) {
          refresher.complete();
        }

        commit("setDataArticles",response.data.data);
      })
      .catch(error => {
        if (refresher) {
          refresher.complete();
        }
      })
    },
    getHistoryTrans: function ({ commit },refresher = "") {
      const dateStart = this.state.historyTransDate.start;
      const dateEnd   = this.state.historyTransDate.end;

      axios.get(`${this.state.APIURL}/transaksi/getdata?start=${dateStart}&end=${dateEnd}&orderby=terbaru`,{
        headers: {
            token: TokenService.getToken()!
          }
      })
      .then(response => {
        if (refresher) {
          refresher.complete();
        }

        commit("setDataHistoryTrans",response.data.data);
      })
      .catch(error => {
        if (refresher) {
          refresher.complete();
        }

        // Unauthorize
        if (error.response.status == 401) {
          if (error.response.data.messages == 'token expired') {
            commit("setDataAlert",{
              show   :true,
              type   :'warning',
              message:'waktu login sudah habis, silahkan login ulang'}
            );
          }

          commit("setDataNasabah","");
          commit("setDataArticles","");
          TokenService.removeToken()!;
          router.push("/login");
        }
        else if(error.response.status == 404) {
          commit("setDataAlert",{
            show   :true,
            type   :'warning',
            message:'<b>Ups...</b> transaksi tidak ditemukan!'}
          );

          setTimeout(() => {
            commit("setDataAlert",{show :false,type :'',message:''});  
          }, 4000);

          commit("setDataHistoryTrans",[]);
        }

      })
    },
  },
  modules: {
  }
})
