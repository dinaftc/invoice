import { ref,  reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

import { useRouter } from 'vue-router'
export const useInvoiceStore = defineStore('invoice',()=> {
const router=useRouter()
const invoiceModal=ref(false)
const modalActive =ref(false)
const invoiceData= ref([])
const invoicesLoaded=ref(false)
const invoiceToAdd=reactive({})
const invoiceToUpdate=ref({})
const editInvoice=ref(false)
const TOGGLE_INVOICE =() =>{
      invoiceModal.value = !invoiceModal.value;
    }
    const TOGGLE_EDIT_INVOICE =() =>{
      editInvoice.value = !editInvoice.value;
    }

const TOGGLE_MODAL=() =>{
      modalActive.value  = !modalActive.value
    }
const UPDATE_STATUS_TO_PAID=async(id)=>{
   await axios.patch(`/invoices/${id}`, {invoicePending:false,invoiceDraft:false,invoicePaid:true})
  getInvoiceById(id)
}
const UPDATE_STATUS_TO_PENDING=async(id)=>{
  await axios.patch(`/invoices/${id}`, {invoicePending:true,invoiceDraft:false,invoicePaid:false})
  getInvoiceById(id)
}

const  ADD_INVOICE=async ()=> {
  console.log(invoiceToAdd)
      let response = await axios.post('/invoices/', invoiceToAdd)
      intiStore(invoiceToAdd)
      router.push({ name: 'home' })
      console.log(response)
      GET_INVOICES()
    }

    const getInvoiceById = async(id) => {
      let response=  await axios.get(`/invoices/${id}`)
      invoiceToUpdate.value=response.data
      };
    
const UPDATE_INVOICE = async (id)=>{
  let response = await axios.post(`/invoices/${id}`, invoiceToUpdate)
  intiStore(invoiceToUpdate)
      router.push({ name: 'home' })
      console.log(response)
      GET_INVOICES()
}
    const intiStore = (intialVariable) => {
      intialVariable.value={}
    }

    const  GET_INVOICES=async ()=> {
      let response = await axios.get('/invoices/')
      invoiceData.value=response.data
    }
const DELETE_INVOICE = async(id)=>{
  await axios.delete(`/invoices/${id}`)
  router.push({ name: 'home' })
  GET_INVOICES()
}
    return {ADD_INVOICE,GET_INVOICES,invoiceData,invoicesLoaded,invoiceModal,TOGGLE_INVOICE,TOGGLE_MODAL,TOGGLE_EDIT_INVOICE,editInvoice,modalActive,invoiceToAdd,invoiceToUpdate,UPDATE_INVOICE,getInvoiceById,DELETE_INVOICE,UPDATE_STATUS_TO_PAID,UPDATE_STATUS_TO_PENDING}
}
);
