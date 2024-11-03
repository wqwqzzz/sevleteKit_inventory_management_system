<!-- 11/2 做到品类管理，建议新增结构体进行处理。因为新增了表，对于之前的出入库也需要进行重新的数据库编写，如1.出库数不能大于库存数 2.库存书不能小于零 等规则 -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import LineChart from './LineChart.svelte';
    import { liquorStore,liquorService } from './liquorStore';
    import { Button,TextInput,Header,Tabs, Space,Modal,Card, SimpleGrid, Image, NumberInput,NativeSelect,Flex,Textarea,Grid,Alert } from '@svelteuidev/core';
    import { goto } from '$app/navigation';

    const chartData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    values: [12, 19, 3, 5, 2, 3]
  };


     // 订阅 store
    $: ({ items, loading, error } = $liquorStore);
    onMount(() => {
        liquorService.fetchLiquors();
        const getCookie = (name: string): string | null => {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? decodeURIComponent(match[2]) : null;
        };
        const token = getCookie('beijiangcookie');
        if (token){
            const userInfo = JSON.parse(atob(token));
            userInfoNow.username = userInfo.username;
            userInfoNow.userrole = userInfo.userrole ===  1?"管理员":"普通用户" ;
            userInfoNow.userid = userInfo.userid;
        }
    });

    let userInfoNow = {
        username:"",
        userrole:"",
        userid:0,
    }
    const updateCateData =(type:string)=>{
       // 只需要根据id进行更新了，删除也是，增加也是
       switch (type) {
    case "addliqu1": // 入库
      if (addCateLiquParm.id) {
        const item = $liquorStore.items.get(addCateLiquParm.id);
        if (item) {
          liquorService.updateItem(addCateLiquParm.id, {
            inventoryCount: item.inventoryCount + addCateLiquParm.count
          });
        }
      }
      break;

    case "addliqu2": // 出库
      if (addCateLiquParm.id) {
        const item = $liquorStore.items.get(addCateLiquParm.id);
        if (item) {
          liquorService.updateItem(addCateLiquParm.id, {
            inventoryCount: item.inventoryCount - addCateLiquParm.count
          });
        }
      }
      break;

    case "modifyliqu": // 更新
      if (modifyCateParm.id) {
        liquorService.updateItem(modifyCateParm.id, {
          name: modifyCateParm.name,
          inventoryCount: modifyCateParm.inventoryCount,
          buyPrice: modifyCateParm.buyPrice,
          sellPrice: modifyCateParm.sellPrice,
          describe: modifyCateParm.describe
        });
      }
      break;

    case "deleteliqu": // 删除
      if (modifyCateParm.id) {
        liquorService.deleteItem(modifyCateParm.id);
      }
      break;

    case "addcate": // 添加
      const newItem: Item = {
        id: tmp_cate_id,
        name: addCateParm.name,
        describe: addCateParm.desc,
        buyPrice: addCateParm.buyPrice,
        sellPrice: addCateParm.sellPrice,
        inventoryCount: 0,
        pic: addCateParm.pic
      };
      liquorService.addItem(newItem);
      break;
  }
        
    };

    let loadingCateData = false;
    let base64Image: string = '';
    let fileInput: HTMLInputElement;
    let isLoading: boolean = false;
    let openedInLiquCate = false;
    let openedInAddMeg = false;
    let openedOutLiquCate = false;
    let openedOutAddMeg = false;
    let openAddLiquCate = false;
    // 声明数量和单瓶价格的可写存储
    let quantity = 0;
    let totalPrice = 0.0;
    let showInAddLiquAlert = false;
    let showOutAddLiquAlert = false;
    let modifyLiquCate = false;
    let modifyName = "";
    let descMesg = "";
    let showModifyAddLiquAlert = false;
    let showInformDeleteCate = false;
    let tmp_cate_id = 0;
    
    type AddCateLiquParm ={
        id:number;
        name: string,
        count : number,
        priceType : string,
        price: number,
    };
    type AddCateParm ={
        name: string,
        desc :string,
        sellPrice: number,
        buyPrice: number,
        pic:string,
    };
    type ModifyCateParm = {
        id:number;
        name: string,
        inventoryCount:number,
        buyPrice : number;
        sellPrice: number;
        describe:string,
    }
    type Item = {
        id:number;
        name: string;
        describe: string;
        pic : string;
        buyPrice : number;
        sellPrice: number;
        inventoryCount: number;
    };
    let addCateLiquParm :AddCateLiquParm={
        id :0,
        name: "",
        count : 0,
        priceType : "1",
        price : 0,
    }
    let addCateParm: AddCateParm = {
        name: "",
        desc: "",
        sellPrice: 0,
        buyPrice: 0,
        pic: "",
    };
    let modifyCateParm: ModifyCateParm = {
        name: "",
        inventoryCount: 0,
        describe: "",
        sellPrice:0,
        buyPrice:0,
        id:0,
    }
    let tempStorePic = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTY2Ny45IDg0My44SDMyNy44Yy0xMi41IDAtMjIuNyAxMC4yLTIyLjcgMjIuN3MxMC4yIDIyLjcgMjIuNyAyMi43aDM0MC4xYzEyLjUgMCAyMi43LTEwLjIgMjIuNy0yMi43cy0xMC4yLTIyLjctMjIuNy0yMi43ek0zNjcuMiA3ODguN2MxMi41IDAgMjIuNy0xMC4yIDIyLjctMjIuN1Y0ODkuOWMwLTEyLjUtMTAuMi0yMi43LTIyLjctMjIuN3MtMjIuNyAxMC4yLTIyLjcgMjIuN1Y3NjZjMCAxMi41IDEwLjIgMjIuNyAyMi43IDIyLjd6TTQ5OS45IDc4OC43YzEyLjUgMCAyMi43LTEwLjIgMjIuNy0yMi43VjQ4OS45YzAtMTIuNS0xMC4yLTIyLjctMjIuNy0yMi43cy0yMi43IDEwLjItMjIuNyAyMi43Vjc2NmMwIDEyLjUgMTAuMiAyMi43IDIyLjcgMjIuN3pNNjM2LjQgNzg4LjdjMTIuNSAwIDIyLjctMTAuMiAyMi43LTIyLjdWNDg5LjljMC0xMi41LTEwLjItMjIuNy0yMi43LTIyLjdzLTIyLjcgMTAuMi0yMi43IDIyLjdWNzY2Yy0wLjEgMTIuNSAxMC4yIDIyLjcgMjIuNyAyMi43eiIgZmlsbD0iIzU5NTc1NyIgLz48cGF0aCBkPSJNODU2LjIgNDAyaC04OC40di0yMC4yYzAtNC42IDIuMi05IDYuMS0xMS41IDI4LjktMTguNiA0Ny44LTQ5IDQ3LjgtODMuNCAwLTQ0LjktMzEuNi04My40LTc3LjQtOTcuMi0zLjQtMS02LjEtMy4zLTcuOS02LjMtMTQuMS0yMy40LTQxLjMtMzguNS03MS45LTM4LjVoLTEuMmMtNS4xIDAuMS05LjktMi40LTEyLjQtNi44LTI0LjgtNDQuOC03Ni4xLTc0LjItMTM0LTc0LjItNTAgMC05NS4xIDIxLjctMTIyLjUgNTYuNy0zLjggNC45LTEwLjQgNi41LTE2LjIgNC4yLTEwLjUtNC4yLTIyLjEtNi41LTMzLjktNi41LTIzLjUgMC00NS40IDguOS02MSAyMy45LTIuOCAyLjctNi44IDQtMTAuNyAzLjUtNC4yLTAuNi04LjUtMC45LTEyLjgtMC45LTQ4IDAtODcgMzUuNC04NyA3OVYzNzFjMCAzMC4zIDE4LjkgNTYuNiA0Ni41IDY5LjkgNC44IDIuMyA3LjggNy4xIDcuOCAxMi40djQ0Ny41YzAgMzIuOCAyNi42IDU5LjQgNTkuNCA1OS40aDQyMmMzMi44IDAgNTkuNC0yNi42IDU5LjQtNTkuNHYtODcuM2g4OC40YzI1LjEgMCA0NS41LTIwLjQgNDUuNS00NS41VjQ0Ny41Yy0wLjEtMjUuMS0yMC41LTQ1LjUtNDUuNi00NS41ek03MDguNCA5MTQuN2gtNDIyYy03LjcgMC0xMy45LTYuMi0xMy45LTEzLjlWNDYwLjdjMC02LjQgNC40LTExLjkgMTAuNy0xMy41IDIxLjgtNS42IDQwLjItMTguNyA1MS41LTM2IDMuNS01LjQgMTAtNy45IDE2LjItNiA4IDIuMyAxNi40IDMuNiAyNC45IDMuNiAxNi44IDAgMzIuOS00LjcgNDYuNS0xMy4yIDQuMi0yLjYgOS40LTIuNyAxMy43LTAuNCAxMC42IDUuNiAyMi45IDguOCAzNS42IDguOCAyNS45IDAgNDguNS0xMi43IDYxLTMxLjcgMy44LTUuNyAxMS4xLTcuNyAxNy40LTUgMTUuMiA2LjYgMzIgMTAuMiA0OS40IDEwLjIgMTIuMiAwIDI0LjMtMS44IDM1LjgtNS4yIDMuOS0xLjIgOC0wLjcgMTEuNSAxLjMgMTguMiAxMC40IDM5LjMgMTYgNjEuMSAxNmgwLjVjNy45IDAgMTQuMyA2LjQgMTQuMyAxNC4zdjQ5Ni45Yy0wLjMgNy43LTYuNSAxMy45LTE0LjIgMTMuOXogbTU5LjEtNjAwLjJjLTkuNCAxNC4yLTMzIDI5LjYtNjAgMjkuNnMtMzkuOC0yNS4xLTU4LTI1LjFjLTE4LjIgMC0yNi4xIDEyLjUtNTAuMyAxMi45LTE0LjUgMC0zOC41LTI0LjEtNzEuOS0xNS44LTExLjcgMi45LTIxLjEgOS4zLTI3LjQgMjItNi4zIDEyLjctMTQuNiAyMC4yLTI4LjUgMjAuMi05LjkgMC0xOS4zLTIwLjktNDMuNi0yMC4yLTI0LjMgMC42LTM4LjIgMjUuMS01Mi4xIDI1LjEtMTMuNCAwLTI1LjktNi4yLTMzLjQtMTYuNWwtMTUuOS0yMS45Yy0yLjYtMy42LTYuOC01LjgtMTEuMy01LjgtNy43IDAtMTMuOSA2LjItMTMuOSAxMy45VjM3MWMwIDE0LjYtMTIuMiAyNy4zLTI4LjcgMzEuOC00LjEgMS4xLTguNCAxLjctMTIuOCAxLjctMTMuMSAwLTI1LTUuMi0zMi43LTEzLjItNS41LTUuNy04LjgtMTIuOC04LjgtMjAuM1YyMjMuOGMwLTE4LjIgMTktMzMuNSA0MS41LTMzLjUgNi43IDAgMTMuMiAxLjMgMTkuMiA0bDcuNyAzLjNjNi44IDMgMTQuOCAwIDE4LjEtNi42bDMuNy03LjVjNS44LTExLjggMjAuMi0xOS43IDM1LjktMTkuNyAxMy41IDAgMjUuOSA1LjcgMzMgMTUuMWw5LjkgMTMuMmM2LjcgOC45IDIwLjYgNi44IDI0LjMtMy44bDUuNC0xNS41YzEzLjEtMzcuMyA1NC4yLTYzLjQgMTAwLTYzLjQgNDguOCAwIDkwLjUgMjguMiAxMDEuNSA2OC43bDIuNiA5LjRjMi4yIDggMTAuOCAxMi4zIDE4LjUgOS4zbDkuMS0zLjVjNS0xLjkgMTAuMy0yLjkgMTUuOC0yLjkgMTcuMyAwIDMyLjQgOS45IDM1LjkgMjMuNGwxLjUgNS43YzEuNCA1LjQgNiA5LjUgMTEuNSAxMC4zbDUuOCAwLjhjMzMuMSA0LjcgNTcgMjguNCA1NyA1Ni4zIDAgMTAtMy4xIDE5LjQtOC42IDI3LjZ6IG0wLjMgNDUzLjVWNDQ3LjVoODguNFY3NjhoLTg4LjR6IiBmaWxsPSIjNTk1NzU3IiAvPjwvc3ZnPg==`
    const defaultPic = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTY2Ny45IDg0My44SDMyNy44Yy0xMi41IDAtMjIuNyAxMC4yLTIyLjcgMjIuN3MxMC4yIDIyLjcgMjIuNyAyMi43aDM0MC4xYzEyLjUgMCAyMi43LTEwLjIgMjIuNy0yMi43cy0xMC4yLTIyLjctMjIuNy0yMi43ek0zNjcuMiA3ODguN2MxMi41IDAgMjIuNy0xMC4yIDIyLjctMjIuN1Y0ODkuOWMwLTEyLjUtMTAuMi0yMi43LTIyLjctMjIuN3MtMjIuNyAxMC4yLTIyLjcgMjIuN1Y3NjZjMCAxMi41IDEwLjIgMjIuNyAyMi43IDIyLjd6TTQ5OS45IDc4OC43YzEyLjUgMCAyMi43LTEwLjIgMjIuNy0yMi43VjQ4OS45YzAtMTIuNS0xMC4yLTIyLjctMjIuNy0yMi43cy0yMi43IDEwLjItMjIuNyAyMi43Vjc2NmMwIDEyLjUgMTAuMiAyMi43IDIyLjcgMjIuN3pNNjM2LjQgNzg4LjdjMTIuNSAwIDIyLjctMTAuMiAyMi43LTIyLjdWNDg5LjljMC0xMi41LTEwLjItMjIuNy0yMi43LTIyLjdzLTIyLjcgMTAuMi0yMi43IDIyLjdWNzY2Yy0wLjEgMTIuNSAxMC4yIDIyLjcgMjIuNyAyMi43eiIgZmlsbD0iIzU5NTc1NyIgLz48cGF0aCBkPSJNODU2LjIgNDAyaC04OC40di0yMC4yYzAtNC42IDIuMi05IDYuMS0xMS41IDI4LjktMTguNiA0Ny44LTQ5IDQ3LjgtODMuNCAwLTQ0LjktMzEuNi04My40LTc3LjQtOTcuMi0zLjQtMS02LjEtMy4zLTcuOS02LjMtMTQuMS0yMy40LTQxLjMtMzguNS03MS45LTM4LjVoLTEuMmMtNS4xIDAuMS05LjktMi40LTEyLjQtNi44LTI0LjgtNDQuOC03Ni4xLTc0LjItMTM0LTc0LjItNTAgMC05NS4xIDIxLjctMTIyLjUgNTYuNy0zLjggNC45LTEwLjQgNi41LTE2LjIgNC4yLTEwLjUtNC4yLTIyLjEtNi41LTMzLjktNi41LTIzLjUgMC00NS40IDguOS02MSAyMy45LTIuOCAyLjctNi44IDQtMTAuNyAzLjUtNC4yLTAuNi04LjUtMC45LTEyLjgtMC45LTQ4IDAtODcgMzUuNC04NyA3OVYzNzFjMCAzMC4zIDE4LjkgNTYuNiA0Ni41IDY5LjkgNC44IDIuMyA3LjggNy4xIDcuOCAxMi40djQ0Ny41YzAgMzIuOCAyNi42IDU5LjQgNTkuNCA1OS40aDQyMmMzMi44IDAgNTkuNC0yNi42IDU5LjQtNTkuNHYtODcuM2g4OC40YzI1LjEgMCA0NS41LTIwLjQgNDUuNS00NS41VjQ0Ny41Yy0wLjEtMjUuMS0yMC41LTQ1LjUtNDUuNi00NS41ek03MDguNCA5MTQuN2gtNDIyYy03LjcgMC0xMy45LTYuMi0xMy45LTEzLjlWNDYwLjdjMC02LjQgNC40LTExLjkgMTAuNy0xMy41IDIxLjgtNS42IDQwLjItMTguNyA1MS41LTM2IDMuNS01LjQgMTAtNy45IDE2LjItNiA4IDIuMyAxNi40IDMuNiAyNC45IDMuNiAxNi44IDAgMzIuOS00LjcgNDYuNS0xMy4yIDQuMi0yLjYgOS40LTIuNyAxMy43LTAuNCAxMC42IDUuNiAyMi45IDguOCAzNS42IDguOCAyNS45IDAgNDguNS0xMi43IDYxLTMxLjcgMy44LTUuNyAxMS4xLTcuNyAxNy40LTUgMTUuMiA2LjYgMzIgMTAuMiA0OS40IDEwLjIgMTIuMiAwIDI0LjMtMS44IDM1LjgtNS4yIDMuOS0xLjIgOC0wLjcgMTEuNSAxLjMgMTguMiAxMC40IDM5LjMgMTYgNjEuMSAxNmgwLjVjNy45IDAgMTQuMyA2LjQgMTQuMyAxNC4zdjQ5Ni45Yy0wLjMgNy43LTYuNSAxMy45LTE0LjIgMTMuOXogbTU5LjEtNjAwLjJjLTkuNCAxNC4yLTMzIDI5LjYtNjAgMjkuNnMtMzkuOC0yNS4xLTU4LTI1LjFjLTE4LjIgMC0yNi4xIDEyLjUtNTAuMyAxMi45LTE0LjUgMC0zOC41LTI0LjEtNzEuOS0xNS44LTExLjcgMi45LTIxLjEgOS4zLTI3LjQgMjItNi4zIDEyLjctMTQuNiAyMC4yLTI4LjUgMjAuMi05LjkgMC0xOS4zLTIwLjktNDMuNi0yMC4yLTI0LjMgMC42LTM4LjIgMjUuMS01Mi4xIDI1LjEtMTMuNCAwLTI1LjktNi4yLTMzLjQtMTYuNWwtMTUuOS0yMS45Yy0yLjYtMy42LTYuOC01LjgtMTEuMy01LjgtNy43IDAtMTMuOSA2LjItMTMuOSAxMy45VjM3MWMwIDE0LjYtMTIuMiAyNy4zLTI4LjcgMzEuOC00LjEgMS4xLTguNCAxLjctMTIuOCAxLjctMTMuMSAwLTI1LTUuMi0zMi43LTEzLjItNS41LTUuNy04LjgtMTIuOC04LjgtMjAuM1YyMjMuOGMwLTE4LjIgMTktMzMuNSA0MS41LTMzLjUgNi43IDAgMTMuMiAxLjMgMTkuMiA0bDcuNyAzLjNjNi44IDMgMTQuOCAwIDE4LjEtNi42bDMuNy03LjVjNS44LTExLjggMjAuMi0xOS43IDM1LjktMTkuNyAxMy41IDAgMjUuOSA1LjcgMzMgMTUuMWw5LjkgMTMuMmM2LjcgOC45IDIwLjYgNi44IDI0LjMtMy44bDUuNC0xNS41YzEzLjEtMzcuMyA1NC4yLTYzLjQgMTAwLTYzLjQgNDguOCAwIDkwLjUgMjguMiAxMDEuNSA2OC43bDIuNiA5LjRjMi4yIDggMTAuOCAxMi4zIDE4LjUgOS4zbDkuMS0zLjVjNS0xLjkgMTAuMy0yLjkgMTUuOC0yLjkgMTcuMyAwIDMyLjQgOS45IDM1LjkgMjMuNGwxLjUgNS43YzEuNCA1LjQgNiA5LjUgMTEuNSAxMC4zbDUuOCAwLjhjMzMuMSA0LjcgNTcgMjguNCA1NyA1Ni4zIDAgMTAtMy4xIDE5LjQtOC42IDI3LjZ6IG0wLjMgNDUzLjVWNDQ3LjVoODguNFY3NjhoLTg4LjR6IiBmaWxsPSIjNTk1NzU3IiAvPjwvc3ZnPg==`
    const squareStyle = {
        width: '45vw', 
        // 怎么把字体居中啊
    };

    const closeInCateModal = () =>{
        openedInLiquCate = false;
    }
    const closeOutCateModal = () =>{
        openedOutLiquCate = false;
    }
    const closeInAddMegModal = () =>{
        openedInAddMeg = false;
        openedInLiquCate = true;
    }
    const closeOutAddMegModal = () =>{
        openedOutAddMeg = false;
        openedOutLiquCate = true;
    }

    const closeInModalAndCate = (item:Item) => {
        openedInLiquCate = false;
        openedInAddMeg = true;
        // 注入parm
        addCateLiquParm.name = item.name;
        addCateLiquParm.id = item.id;
    }
    const closeOutModalAndCate = (item:Item) => {
        openedOutLiquCate = false;
        openedOutAddMeg = true;
        // 注入parm
        addCateLiquParm.name = item.name;
        addCateLiquParm.id = item.id;
    }
    const openModifyLiquCate = (item:Item) => {
        modifyLiquCate = true;
        // 注入
        modifyCateParm.name = item.name;
        modifyCateParm.id = item.id;
        modifyCateParm.inventoryCount = item.inventoryCount;
        modifyCateParm.buyPrice = item.buyPrice;
        modifyCateParm.sellPrice = item.sellPrice;
        modifyCateParm.describe = item.describe;

    }
    const openModifyDeleteLiquCate = () => {
        showInformDeleteCate = true;
    }
    const closeModifyLiquCate = () => {
        modifyLiquCate = false;
    }
    const closeInSuccessAdd = async () => {
    if (addCateLiquParm.count != 0 ) {
        try {
        // 发送 POST 请求
        const response = await fetch('/api/store/addliqu?type=1', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(addCateLiquParm),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // 请求成功,关闭窗口
        openedInLiquCate = false;
        openedInAddMeg = false;

        // 成功提示
        alert("入库成功!");
        // 更新库存数据
        await updateCateData("addliqu1");

        // 清理数据
        addCateLiquParm.name = "";
        addCateLiquParm.price = 0.0;
        addCateLiquParm.count = 0;
        addCateLiquParm.priceType = "1";
        addCateLiquParm.id = 0;

        } catch (error) {
        console.error('Error:', error);
        // 错误提示
        alert("添加失败,请重试!");
        }
    } else {
        // 数据不完整时调用handleInClick
        handleInClick();
    }
    }
    const closeOutSuccessAdd = async() => {
        if (addCateLiquParm.count != 0 ) {
        try {
        // 发送 POST 请求
        const response = await fetch('/api/store/addliqu?type=2', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(addCateLiquParm),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // 请求成功,关闭窗口
        openedOutLiquCate = false;
        openedOutAddMeg = false;
        
        // 成功提示
        alert("出库成功!");
        // 更新库存数据
        await updateCateData("addliqu2");

        // 清理数据
        addCateLiquParm.name = "";
        addCateLiquParm.price = 0.0;
        addCateLiquParm.count = 0;
        addCateLiquParm.priceType = "1";
        addCateLiquParm.id = 0;

        } catch (error) {
        console.error('Error:', error);
        // 错误提示
        alert("添加失败,请重试!");
        }
    } else {
        // 数据不完整时调用handleInClick
        handleOutClick();
    }
    }
    const closeModifySuccessAdd = async () => {
        if (modifyCateParm.name != "" && modifyCateParm.buyPrice !=0 &&modifyCateParm.sellPrice != 0 && modifyCateParm.id != 0){
            
          // post 进行提交
          try {
        // 发送 POST 请求
        const response = await fetch('/api/store/modifyliqu', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(modifyCateParm),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // 请求成功,关闭窗口
        modifyLiquCate = false;
        
        // 成功提示
        alert("更新成功!");
        // 更新库存数据
        await updateCateData("modifyliqu");

        // 清理数据
        modifyCateParm.name = "";
        modifyCateParm.buyPrice = 0.0;
        modifyCateParm.sellPrice = 0.0;
        modifyCateParm.id = 0;
        modifyCateParm.describe = "";
        modifyCateParm.inventoryCount = 0;

        } catch (error) {
        console.error('Error:', error);
        // 错误提示
        alert("添加失败,请重试!");
        }
        }else{
            handleModifyClick();
        } 
    }
    const closeAddLiquCateSuccess = async() => {
        if (addCateParm.name!=""){
            // 进行post ，提交品类
            addCateParm.pic = tempStorePic;
            try {
        // 发送 POST 请求
        const response = await fetch('/api/store/addcate', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(addCateParm),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // 请求成功,关闭窗口
        openAddLiquCate = false;
        

        // 更新库存数据
        type tmpQuery = {
          id :number,
        }
        let tmpans:tmpQuery =await response.json();
        // 成功提示
        alert("添加品类成功!");
        // 更新库存数据
        tmp_cate_id = tmpans.id;
        await updateCateData("addcate");

        // 清理数据
        tempStorePic = defaultPic;
        addCateParm.name = "";
        addCateParm.pic = "";
        addCateParm.buyPrice = 0;
        addCateParm.sellPrice = 0;
        addCateParm.desc="";
        tmp_cate_id=0;
        } catch (error) {
        console.error('Error:', error);
        // 错误提示
        alert("添加失败,请重试!");
        }

        }else{

        }
    }
    const closeInformDeleteCate = () => {
        showInformDeleteCate = false;
    }
    const closeAddLiquCate = () => {
        openAddLiquCate = false;
    }
    const closeInformDeleteCateSuccess = async() => {
        // 还需要进行一个弹窗或tip 告诉删除成功
        modifyLiquCate = false;
        showInformDeleteCate = false;   
        // 进行删除操作，
        try {
        // 发送 POST 请求
        const response = await fetch('/api/store/deleteliqu', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(modifyCateParm),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // 请求成功,关闭窗口
        modifyLiquCate = false;
        
        // 成功提示
        alert("删除成功!");
        // 更新库存数据
        await updateCateData("deleteliqu");

        // 清理数据
        modifyCateParm.name = "";
        modifyCateParm.buyPrice = 0.0;
        modifyCateParm.sellPrice = 0.0;
        modifyCateParm.id = 0;
        modifyCateParm.describe = "";
        modifyCateParm.inventoryCount = 0;

        } catch (error) {
        console.error('Error:', error);
        // 错误提示
        alert("添加失败,请重试!");
        }

    }

    function handleInClick() {
        // 显示警告
        showInAddLiquAlert = true;

        // 设置一个定时器，在3秒后自动隐藏警告
        setTimeout(() => {
            showInAddLiquAlert = false;
        }, 3000);
    }

    function handleOutClick() {
        // 显示警告
        showOutAddLiquAlert = true;

        // 设置一个定时器，在3秒后自动隐藏警告
        setTimeout(() => {
            showOutAddLiquAlert = false;
        }, 3000);
    }
    function handleModifyClick() {
        // 显示警告
        showModifyAddLiquAlert = true;

        // 设置一个定时器，在3秒后自动隐藏警告
        setTimeout(() => {
            showModifyAddLiquAlert = false;
        }, 3000);
    }
    function ruku() {
        openedInLiquCate = true;

    }
    // function openModal() {
    //   formType = type;
    //   opened = true;
    // }

    function handleFileSelection(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;

    if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        // 使用 FileReader 读取文件
        reader.onload = () => {
            const imageUrl = URL.createObjectURL(file);
            const img = document.createElement("img"); // 使用 document.createElement 而不是 new Image()
            img.src = imageUrl;

            img.onload = () => {
                // 创建一个 Canvas 元素来进行压缩
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                // 设置压缩后的尺寸，例如宽度 300px
                const maxWidth = 300;
                const scale = maxWidth / img.width;
                const newWidth = maxWidth;
                const newHeight = img.height * scale;

                canvas.width = newWidth;
                canvas.height = newHeight;

                if (context) {
                    // 在 Canvas 上绘制压缩后的图像
                    context.drawImage(img, 0, 0, newWidth, newHeight);

                    // 将 Canvas 转换为 Base64 编码的 Data URL
                    const base64Image = canvas.toDataURL("image/jpeg", 0.7); // 0.7 表示质量，可调整

                    // 存储或使用压缩后的 Base64 编码
                    tempStorePic = base64Image;
                }
            };
        };

        // 将文件读取为 Data URL（触发 `reader.onload`）
        reader.readAsDataURL(file);
    }
}

  // 图片压缩函数

   
  

  // 清除图片
  function clearImage() {
    base64Image = '';
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // 触发拍照
  function triggerCamera() {
    if (fileInput) {
      fileInput.click();
    }
  }

  function tuichu() {
    // 清除用户信息
    const now_roller =userInfoNow.userrole === "管理员" ? 1 : 2;
    const payload = { userid: userInfoNow.userid, username: userInfoNow.username, userrole: now_roller };
    const jsonString = JSON.stringify(payload);
    console.log(jsonString)
    const token1= btoa(jsonString);
    console.log(token1)
    document.cookie =`beijiangcookie=;Max-Age=86400;Path=/`  
    // 跳转到登录页面
    goto("/login")
  }
  </script>
<Header height={60} slot="header">
  <div class="header-content">
    <h1>酒水库存管理系统</h1>
    <div class="user-controls">
      <div class="user-info">
        <span>{userInfoNow.username}</span>
        <span class="role-badge">{userInfoNow.userrole}</span>
      </div>
      <Button variant="subtle" color='#79a8a9' on:click={tuichu}>
        退出登录
      </Button>
    </div>
  </div>
</Header>

<style>
  .header-content {
    display: flex;
    justify-content: space-between;  /* 左右两端对齐 */
    align-items: center;  /* 垂直居中 */
    height: 100%;        /* 占满header高度 */
    padding: 0 20px;     /* 左右padding */
  }

  .user-controls {
    display: flex;
    align-items: center;
    gap: 20px;          /* 控制元素之间的间距 */
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;          /* 用户信息内部元素间距 */
  }

  .role-badge {
    background: #f0f0f0;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
</style>

  <Tabs color='teal' tabPadding="xl" grow>
    <Tabs.Tab label='库存管理'>
        <Flex justify="center" gap="xl">
            <Button color='#79a8a9'     
                    override={squareStyle}
                    size="xl" 
                    on:click={ruku}
                    ripple>入库</Button>
            <Button color='#1f4e5f'     
                override={squareStyle}
                size="xl" 
                on:click={() => (openedOutLiquCate = true)}
                ripple>出库</Button>
        </Flex>
    </Tabs.Tab>
    <Tabs.Tab label='品类管理'color='blue'>
        {#if loading}
        <div>加载中...</div>
      {:else if error}
        <div>加载失败: {error.message}</div>
      {:else}
        <SimpleGrid
          breakpoints={[
            { maxWidth: 10, cols: 4, spacing: 'md' },
            { maxWidth: 10, cols: 3, spacing: 'md' },
            { maxWidth: 10, cols: 2, spacing: 'md' },
            { maxWidth: 10, cols: 1, spacing: 'md' }
          ]}
          cols={4}
        >
          {#each items.entries() as [id, item]}
          <button on:click={() => openModifyLiquCate(item)}>
            <Image 
              src={item.pic}  
              alt={item.describe}
              fit="contain" 
              caption={item.name}
            />
            <!-- 如果需要显示描述 -->
            <div>{item.describe}</div>
            <div>单价：{item.buyPrice}</div>
            <div>数量：{item.inventoryCount}</div>
          </button>
        {/each}
        </SimpleGrid>
        {/if}
    <Space  h="lg"  />
    <Space  h="lg"  />
    <Button color='#79a8a9' fullSize on:click={()=>{openAddLiquCate=true}} size="xl" >新增酒品信息</Button>
    </Tabs.Tab>
    
    <Tabs.Tab label='数据展示' color='pink'>

      <div class="chart-container">
        <LineChart 
          labels={chartData.labels} 
          data={chartData.values} 
        />
      </div>

    </Tabs.Tab>
</Tabs> 


<!-- 选择酒类的modal -->
<Modal opened={openedInLiquCate} on:close={closeInCateModal} title="选择酒类" overflow="inside" size="xl">
    {#if loading}
    <div>加载中...</div>
  {:else if error}
    <div>加载失败: {error.message}</div>
  {:else}
    <SimpleGrid
      breakpoints={[

        { maxWidth: 10, cols: 4, spacing: 'md' },
        { maxWidth: 10, cols: 3, spacing: 'md' },
        { maxWidth: 10, cols: 2, spacing: 'md' },
        { maxWidth: 10, cols: 1, spacing: 'md' }
      ]}
      cols={4}
    >
        {#each items.entries() as [id, item]}
        <button on:click={() => closeInModalAndCate(item)}>
          <Image 
            src={item.pic}  
            alt={item.describe}
            fit="contain" 
            caption={item.name}
          />
          <!-- 如果需要显示描述 -->
          <div>{item.describe}</div>
          <div>单价：{item.buyPrice}</div>
        </button>
      {/each}
    </SimpleGrid>
  {/if}
</Modal>
<!-- 选择酒类成功后调用的modal -->
<Modal opened={openedInAddMeg} on:close={closeInAddMegModal} title="入库酒类">
    {#if showInAddLiquAlert}<Alert title="请输入完整信息!">数量未输入</Alert>{/if}
    <Flex direction="column">
        <Textarea disabled label="品类名称" size="lg" rows={1} bind:value={addCateLiquParm.name} />
        <NumberInput placeholder="酒类数量" size="lg" required hideControls label="请输入入库数量" bind:value={addCateLiquParm.count} />
        <NativeSelect
            required
            size="lg"
            data={[
            { label: '总价格', value: '1' },
            { label: '单瓶价格', value: '2' },
            ]}
            label="选择价格模式"
            bind:value={addCateLiquParm.priceType}
        />
        <NumberInput
            label='价格'
            required
            precision={2}
            min={0}
            max={10000}
            step={0.01}  size="lg" hideControls bind:value={addCateLiquParm.price}  
        />
        <Space  h="lg"  />
        <Button color='#79a8a9'     
            size="xl" 
            on:click={closeInSuccessAdd}
            ripple>提交</Button>
    </Flex>
</Modal>

<Modal opened={openedOutLiquCate} on:close={closeOutCateModal} title="选择酒类" overflow="inside" size="xl">
    {#if loading}
    <div>加载中...</div>
  {:else if error}
    <div>加载失败: {error.message}</div>
  {:else}
    <SimpleGrid
      breakpoints={[
        { maxWidth: 10, cols: 4, spacing: 'md' },
        { maxWidth: 10, cols: 3, spacing: 'md' },
        { maxWidth: 10, cols: 2, spacing: 'md' },
        { maxWidth: 10, cols: 1, spacing: 'md' }
      ]}
      cols={4}
    >
        {#each items.entries() as [id, item]}
        <button on:click={() => closeOutModalAndCate(item)}>
          <Image 
            src={item.pic}  
            alt={item.describe}
            fit="contain" 
            caption={item.name}
          />
          <!-- 如果需要显示描述 -->
          <div>{item.describe}</div>
          <div>单价：{item.buyPrice}</div>
        </button>
      {/each}
    </SimpleGrid>
  {/if}
</Modal>
<!-- 选择酒类成功后调用的modal -->
<Modal opened={openedOutAddMeg} on:close={closeOutAddMegModal} title="出库酒类">
    {#if showOutAddLiquAlert}<Alert title="请输入完整信息!">数量未输入</Alert>{/if}
    <Flex direction="column">
        <Textarea disabled label="品类名称" size="lg" rows={1} bind:value={addCateLiquParm.name} />
        <NumberInput placeholder="酒类数量" size="lg" required hideControls label="请输入出库数量" bind:value={addCateLiquParm.count} />
        <NativeSelect
            required
            size="lg"
            data={[
            { label: '总价格', value: '1' },
            { label: '单瓶价格', value: '2' },
            ]}
            label="选择价格模式"
            bind:value={addCateLiquParm.priceType}
        />
        <NumberInput
            label='价格'
            required
            precision={2}
            min={0}
            max={10000}
            step={0.01}  size="lg" hideControls bind:value={addCateLiquParm.price}  
        />
        <Space  h="lg"  />
        <Button color='#79a8a9'     
            size="xl" 
            on:click={closeOutSuccessAdd}
            ripple>提交</Button>
    </Flex>
</Modal>

<Modal opened={modifyLiquCate} on:close={closeModifyLiquCate} title="修改信息">
    {#if showModifyAddLiquAlert}<Alert title="请输入完整信息!">名称、数量其中一值未输入</Alert>{/if}
    <Flex direction="column">
        <Textarea label="品类名称" size="lg" rows={1} bind:value={modifyCateParm.name} />
        <NumberInput placeholder="酒类数量" size="lg" required hideControls label="现库存数" bind:value={modifyCateParm.inventoryCount} />
        <NumberInput
            label='购入价格'
            required
            precision={2}
            min={0}
            max={10000}
            step={0.01}  size="lg" hideControls bind:value={modifyCateParm.buyPrice}  
        />
        <NumberInput
            label='售出价格'
            required
            precision={2}
            min={0}
            max={10000}
            step={0.01}  size="lg" hideControls bind:value={modifyCateParm.sellPrice}  
        />
        <Textarea label="备注信息" size="lg" rows={1} bind:value={modifyCateParm.describe} />
    </Flex>
    <Space  h="lg"  />
    <Grid grow>    
        <Grid.Col span={4}>        
            <Button color='#79a8a9'     
            size="xl" 
            on:click={closeModifySuccessAdd}
            ripple>提交修改信息</Button></Grid.Col>

        <Grid.Col span={4}> 
            <Button color='#79a8a9'     
            size="xl" 
            on:click={openModifyDeleteLiquCate}
            ripple>删除该品类</Button>
        </Grid.Col>
    </Grid>
</Modal>

<Modal opened={showInformDeleteCate} on:close={closeInformDeleteCate} title="确定删除该品类吗？">
            <Button color='#79a8a9'     
            size="xl"
            fullSize
            on:click={closeInformDeleteCateSuccess}
            ripple>确定</Button>
</Modal>

<Modal opened={openAddLiquCate} on:close={closeAddLiquCate} title="新增品类信息">
    <SimpleGrid  cols={1}>
        <Image radius='sm' fit='contain' src={tempStorePic} />
        <Button color='#79a8a9'     
        size="sm"
        fullSize
        ripple
        on:click={() => document.getElementById("take-event")?.click()}
        >拍照上传酒类图片</Button>
        <Space  h="lg"  />
        <TextInput placeholder="请输入酒类名称" size="lg" bind:value={addCateParm.name} label="酒类名称"/>
        <Space  h="lg"  />
        <NumberInput placeholder="请输入酒类进价" precision={2} hideControls bind:value={addCateParm.buyPrice} required size="lg" label="酒类进价"/>
        <Space  h="lg"  />
        <NumberInput placeholder="请输入酒类售价" precision={2} hideControls bind:value={addCateParm.sellPrice} required size="lg" label="酒类售价"/>
        <Space  h="lg"  />
        <TextInput placeholder="请输入酒类描述信息" size="lg"  bind:value={addCateParm.desc} label="酒类描述"/>
        <Space  h="lg"  />
        <Button color='#79a8a9'     
        size="sm"
        fullSize
        ripple
        on:click={closeAddLiquCateSuccess}
        >提交</Button>
    </SimpleGrid>

</Modal>
<input
    type="file"
    id="take-event"
    accept="image/*,camera"
    capture="environment"
    on:change={handleFileSelection}
    style="display: none;"
/>