<template>
    <div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column">
      <form @submit.prevent="submitForm" class="invoice-content">
        <Loading v-show="loading"/>
       
        <h1 v-if="!invoiceStore.editInvoice">New Invoice</h1>
        <h1 v-else>Edit Invoice</h1>
  
        <!-- Bill From -->
        <div class="bill-from flex flex-column">
          <h4>Bill From</h4>
          <div class="input flex flex-column">
            <label for="billerStreetAddress">Street Address</label>
            <input required type="text" id="billerStreetAddress" v-model="state.billerStreetAddress " />
          </div>
          <div class="location-details flex">
            <div class="input flex flex-column">
              <label for="billerCity">City</label>
              <input required type="text" id="billerCity" v-model="state.billerCity" />
            </div>
            <div class="input flex flex-column">
              <label for="billerZipCode">Zip Code</label>
              <input required type="text" id="billerZipCode" v-model="state.billerZipCode" />
            </div>
            <div class="input flex flex-column">
              <label for="billerCountry">Country</label>
              <input required type="text" id="billerCountry" v-model="state.billerCountry" />
            </div>
          </div>
        </div>
  
        <!-- Bill To -->
        <div class="bill-to flex flex-column">
          <h4>Bill To</h4>
          <div class="input flex flex-column">
            <label for="clientName">Client Name</label>
            <input required type="text" id="clientName" v-model="state.clientName" />
          </div>
          <div class="input flex flex-column">
            <label for="clientEmail">Client Email</label>
            <input required type="text" id="clientEmail" v-model="state.clientEmail" />
          </div>
          <div class="input flex flex-column">
            <label for="clientStreetAddress">Street Address</label>
            <input required type="text" id="clientStreetAddress" v-model="state.clientStreetAddress" />
          </div>
          <div class="location-details flex">
            <div class="input flex flex-column">
              <label for="clientCity">City</label>
              <input required type="text" id="clientCity" v-model="state.clientCity" />
            </div>
            <div class="input flex flex-column">
              <label for="clientZipCode">Zip Code</label>
              <input required type="text" id="clientZipCode" v-model="state.clientZipCode" />
            </div>
            <div class="input flex flex-column">
              <label for="clientCountry">Country</label>
              <input required type="text" id="clientCountry" v-model="state.clientCountry" />
            </div>
          </div>
        </div>
  
        <!-- Invoice Work Details -->
        <div class="invoice-work flex flex-column">
          <div class="payment flex">
            <div class="input flex flex-column">
              <label for="invoiceDate">Invoice Date</label>
              <input disabled type="text" id="invoiceDate" v-model="state.invoiceDate" />
            </div>
            <div class="input flex flex-column">
              <label for="paymentDueDate">Payment Due</label>
              <input disabled type="text" id="paymentDueDate" v-model="state.paymentDueDate" />
            </div>
          </div>
          <div class="input flex flex-column">
            <label for="paymentTerms">Payment Terms</label>
            <select required type="text" id="paymentTerms" v-model="state.paymentTerms">
              <option value="30">Net 30 Days</option>
              <option value="60">Net 60 Days</option>
            </select>
          </div>
          <div class="input flex flex-column">
            <label for="productDescription">Product Description</label>
            <input required type="text" id="productDescription" v-model="state.productDescription" />
          </div>
          <div class="work-items">
            <h3>Item List</h3>
            <table class="item-list">
              <tr class="table-heading flex">
                <th class="item-name">Item Name</th>
                <th class="qty">Qty</th>
                <th class="price">Price</th>
                <th class="total">Toal</th>
              </tr>
              <tr class="table-items flex" v-for="(item, index) in TempinvoiceItemList" :key="index">
                <td class="item-name"><input type="text" v-model="item.itemName" /></td>
                <td class="qty"><input type="text" v-model="item.qty" /></td>
                <td class="price"><input type="text" v-model="item.price" /></td>
                <td class="total flex">${{ (item.total = item.qty * item.price) }}</td>
                <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt="" />
              </tr>
            </table>
            <div @click="addNewInvoiceItem" class="flex button">
              <img src="@/assets/icon-plus.svg" alt="" />
              Add New Item
            </div>
          </div>
        </div>
  
        <!-- Save/Exit -->
        <div class="save flex">
          <div class="left">
            <button type="button" @click="closeInvoice" class="red">Cancel</button>
          </div>
          <div class="right flex">
            <button v-if="!invoiceStore.editInvoice" type="submit" @click="saveDraft" class="dark-purple">Save Draft</button>
            <button v-if="!invoiceStore.editInvoice" type="submit" @click="publishInvoice" class="purple">Create Invoice</button>
            <button v-if="invoiceStore.editInvoice" type="sumbit" class="purple" @click="updateInvoice">Update Invoice</button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted, computed, watch} from "vue";
  import { useInvoiceStore } from '../stores/counter';
  import {uid} from 'uid'

import Loading from '@/components/Loading.vue';
const invoiceStore = useInvoiceStore();
const invoiceWrap = ref(null);
  const dateOptions = { year: "numeric", month: "short", day: "numeric" };
  const loading = ref(null);
  const TempinvoiceItemList=ref([])
    
  // Define your data properties using ref() and reactive()
  const state = ref({
    billerStreetAddress: null,
    billerCity: null,
    billerZipCode: null,
    billerCountry: null,
    clientName: null,
    clientEmail: null,
    clientStreetAddress: null,
    clientCity: null,
    clientZipCode: null,
    clientCountry: null,
    invoiceDateUnix: ref(Date.now()),
    invoiceDate: null,
    paymentDueDateUnix: ref(Date.now()),
    paymentDueDate: null,
    paymentTerms: 0,
    productDescription: null,
    invoicePending: null,
    invoiceDraft: null,
    invoiceItemList: [],
    invoiceTotal: computed(() => {
      let total = 0;
      state.value.invoiceItemList.forEach((item) => {
        total += item.total;
      });
      return total;
    }),
  });
 
onMounted(() => {

  state.value=invoiceStore.invoiceToUpdate
TempinvoiceItemList.value=state.value.invoiceItemList
})

const updateInvoice=async()=>{
await invoiceStore.UPDATE_INVOICE(state.value.id)
}
  function addDaysToCurrentDate(days) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate.getTime(); // Return the Unix timestamp of the new date
  }

  watch(() => state.value.paymentTerms, (newPaymentTerm) => {
    // Update paymentDueDateUnix based on the selected payment term
    if (newPaymentTerm === 30) {
      state.value.paymentDueDateUnix = addDaysToCurrentDate(30);
      console.log('30')
    } else if (newPaymentTerm === 60) {
      state.value.paymentDueDateUnix = addDaysToCurrentDate(60);
    }
  });
  
  watch(() => state.value.paymentDueDateUnix, () => {
    // Recompute paymentDueDate whenever paymentDueDateUnix changes
    state.value.paymentDueDate = computed(() => new Date(state.value.paymentDueDateUnix).toLocaleDateString('en-us', dateOptions));
  });
  
  const closeInvoice = () => {
    invoiceStore.TOGGLE_INVOICE();
  };

  

const addNewInvoiceItem = ()=>{
  let item={
id:uid(),
itemName:'',
qty:'',
price:0,
total:0
    }
TempinvoiceItemList.value.push(item)

  }
const deleteInvoiceItem = (idToDelete) => {
state.value.invoiceItemList = state.value.invoiceItemList.filter((item) => item.id !== idToDelete);
};

const publishInvoice = ()=>{
state.value.invoicePending = true
}
const saveDraft = ()=>{
state.value.invoiceDraft = true
}
const uploadInvoice = async () => {
  if (state.value.invoiceItemList.length <= 0) {
    alert('Fill out work items');
    return;
  }
  try {
    state.value.invoiceItemList=TempinvoiceItemList
    loading.value=true
    if (invoiceStore.editInvoice){
      Object.assign(invoiceStore.invoiceToUpdate, state)
      updateInvoice()}
     else {
      Object.assign(invoiceStore.invoiceToAdd, state)  
      invoiceStore.invoiceToAdd.id=uid()
      console.log('After assigning invoiceToAdd:', invoiceStore.invoiceToAdd);
      await invoiceStore.ADD_INVOICE()}
      invoiceStore.TOGGLE_INVOICE();
  } catch (error) {
    alert('Error uploading the invoice: ' + error.message);
  }
  loading.value=false
};
const submitForm = ()=>{
uploadInvoice();
}

const checkClick = (e) => {
  const formElement = document.querySelector('.invoice-content'); // Adjust the selector as needed

  if (invoiceWrap.value && invoiceWrap.value.contains(e.target)) {
    // Check if the click is inside invoiceWrap
    if (!formElement.contains(e.target)) {
      // Check if the click is not inside the form
      invoiceStore.TOGGLE_MODAL();
    }
  }
};

  </script>
  
<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }

    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>