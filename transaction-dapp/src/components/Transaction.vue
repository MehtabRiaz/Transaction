<template>
  <div class="w-sm space-y-4">
    <div class="flex items-center justify-between w-full">
      <span class="capitalize text-white text-3xl font-medium">
        transaction
      </span>
      <UButton
        icon="i-ph-wallet"
        color="primary"
        size="lg"
        class=""
        :ui="{ base: 'w-40' }"
        :loading="connectingWallet"
        @click="connectWallet"
      >
        Connect Wallet
      </UButton>
    </div>

    <div class="w-full flex items-center justify-between">
      <span class="capitalize text-gray-500">Available Balance</span>
      <span class="slashed-zero tabular-nums text-white text-2xl font-medium">
        {{ balance || "--" }} ETH
      </span>
    </div>

    <div class="w-full flex items-center space-x-2">
      <UInput
        v-model="depositAmount"
        label="Enter deposit amount in ETH"
        placeholder="Deposit at least 0.00063 ETH"
        type="number"
        class="w-full"
        :ui="{ base: 'w-full' }"
      />
      <UButton
        label="Deposit"
        color="info"
        variant="soft"
        @click="transaction.depositFund(contract, depositAmount)"
      />
    </div>

    <UButton
      color="error"
      label="Withdraw All Funds"
      variant="outline"
      :ui="{ base: 'w-full' }"
      block
      @click="transaction.withdrawFunds(contract)"
    />
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import * as transaction from "../utils/transaction";
import * as formatter from "../utils/formatter";

//WALLET CONNECT
const contract = ref(null);
const balance = ref("");
const account = ref(null);
const connectingWallet = ref(false);
async function connectWallet() {
  connectingWallet.value = true;
  account.value = await transaction.getAccount();
  balance.value = formatter.wieToEth(await transaction.getBalance());
  connectingWallet.value = false;
}
onBeforeMount(async () => {
  contract.value = await transaction.getContract();
  connectWallet();
});

//TRANSACTION
const depositAmount = ref("");
</script>
