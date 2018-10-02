<template>
    <div class="office">
        <div class="office__header">
            <div class="office__header-logo">
                <img src="/static/img/uP_light.svg" alt="">
            </div>
            <div class="office__header-name">
                smart office
            </div>
            <div class="office__header-date">
                <img src="/static/img/date.svg" alt="">
                {{ date }}
            </div>
            <div class="office__header-time">
                <img src="/static/img/time.svg" alt="">
                {{ time }}
            </div>
        </div>
        <div class="office__row">
            <div class="officeLeft">
                <div class="officeLeft__actions">
                    <div class="officeLeft__actions-row">
                        <div class="officeLeft__actions-item" @click="pressAction(item.namespace)" v-for="(item, index) in actions" :key="index">
                            <div class="itemName">{{item.textUp}}</div>
                            <div class="itemIcon"><img :src="'./static/img/'+item.icon" alt=""></div>
                            <div class="itemTitle">{{item.textDown}}</div>
                        </div>
                    </div>
                </div>
                <div class="officeLeft__notification">
                    <div class="officeLeft__notification-title">
                        <img src="/static/img/notify.svg" alt="">
                        Оповещения
                    </div>
                    <div class="officeLeft__notification-table">
                        <el-table
                                :data="messages"
                                style="width: 100%"
                                height="413">
                            <el-table-column
                                    prop="date"
                                    label="Дата"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="source"
                                    label="Тип"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="text"
                                    label="Сообщение">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="officeRight">
                <div class="officeRight-row">
                    <div class="officeRight__card" v-for="(item, index) in widgets" :key="index" :class="item.type === 'error' ? 'officeRight__card-err' : ''">
                        <div class="officeRight__card-title">{{item.title}}</div>
                        <div class="officeRight__card-icon">
                            <img :src="'./static/img/'+item.iconErr" alt="" v-if="item.status === false">
                            <img :src="'./static/img/'+item.icon" alt="" v-else>
                        </div>
                        <div class="officeRight__card-status" :class="item.status ? 'status-green' : ''">{{item.value}}<i class="mdi" :class="item.mdi"></i></div>
                    </div>
                </div>

                <div class="officeRight-row rowActions">
                    <div class="officeRight__action" v-for="(item, index) in indicators" :key="index">
                        <div class="officeRight__action-icon" v-if="item.title && !item.value">
                            <img :src="'./static/img/lamp_on.svg'" alt="">
                        </div>
                        <div class="officeRight__action-icon" v-if="item.title && item.value">
                            <img :src="'./static/img/lamp_off.svg'" alt="">
                        </div>
                        <div class="officeRight__action-icon" v-if="!item.title">
                            <img src="/static/img/inactive%20lamp.svg" alt="">
                        </div>
                        <div class="officeRight__action-name">{{item.title}}</div>
                    </div>
                </div>

                <div class="officeRight-row">
                    <div class="officeRight__atmo">
                        <div class="officeRight__atmo-title">Атмосфера в помещение</div>
                        <div class="officeRight__atmo-temp"><img src="/static/img/thermometer.svg" alt="">{{ info.atmosphere.temp }}ºC</div>
                        <div class="officeRight__atmo-wet"><img src="/static/img/drop.svg" alt="">{{ info.atmosphere.humidity }}%</div>
                    </div>
                    <div class="officeRight__course">
                        <div class="officeRight__course-title">Курс валют</div>
                        <div class="officeRight__course-info"><img src="/static/img/euro.svg" alt="">{{ info.rate.dollar }} <i class="mdi mdi-currency-rub"></i></div>
                        <div class="officeRight__course-info"><img src="/static/img/dollar.svg" alt="">{{ info.rate.euro }} <i class="mdi mdi-currency-rub"></i></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    const moment = require('moment');

    export default {
        data(){
            return{
                actions: [],
                messages: [],
                widgets: [],
                indicators: [],
                info: {
                    atmosphere: {
                        temp: 0,
                        humidity: 0
                    },
                    rate: {
                        dollar: 0,
                        euro: 0
                    }
                },

                time: '',
                date: '',

                socket: null,

                active: true,
                // actionsList:[
                //     {name: 'Кухня', icon: 'on_off.svg', title: 'вкл / выкл', action: ''},
                //     {name: 'Этаж 2', icon: 'on_off.svg', title: 'вкл / выкл', action: ''},
                //     {name: '', icon: '', title: '', action: ''},
                //     {name: '', icon: '', title: '', action: ''},
                //     {name: 'Весь свет', icon: 'on_off.svg', title: 'вкл / выкл', action: ''},
                //     {name: 'Линия 1', icon: 'on_off.svg', title: 'вкл / выкл', action: ''},
                //     {name: 'Линия 1', icon: 'flash.svg', title: 'Помигать', action: ''},
                //     {name: '', icon: '', title: '', action: ''},
                //     {name: '', icon: '', title: '', action: ''},
                //     {name: '', icon: '', title: '', action: ''},
                //     {name: 'Линия 2', icon: 'on_off.svg', title: 'вкл / выкл', action: ''},
                //     {name: 'Линия 2', icon: 'flash.svg', title: 'вкл / выкл', action: ''},
                //     {name: '', icon: '', title: '', action: ''},
                //     {name: '', icon: '', title: '', action: ''},
                //     {name: 'Диско', icon: 'disco.svg', title: 'вкл / выкл', action: ''},
                // ],
                // tableData: [
                //     {
                //     date: '12:11:48',
                //     typeName: 'Ошибка UPoint',
                //     message: 'Linux Or Windows Which Is It'
                // }, {
                //     date: '13:12:47',
                //     typeName: 'Ошибка модуля',
                //     message: 'Unmatched Toner Cartridge Quality 20 Less Than Oem Price'
                // }, {
                //     date: '12:11:48',
                //     typeName: 'Другое',
                //     message: 'For Women Only Your Computer Usage Could Cost You Your Job'
                // }, {
                //     date: '12:11:48',
                //     typeName: 'Другое',
                //     message: 'While most people enjoy casino gambling, sports betting, lottery and bingo playing for the fun and excitement it provides, others may experience gambling as an addictive and distractive habit. '
                // }, {
                //     date: '12:11:48',
                //     typeName: 'Другое',
                //     message: 'While most people enjoy casino gambling, sports betting, lottery and bingo playing for the fun and excitement it provides, others may experience gambling as an addictive and distractive habit. '
                // }, {
                //     date: '12:11:48',
                //     typeName: 'Другое',
                //     message: 'While most people enjoy casino gambling, sports betting, lottery and bingo playing for the fun and excitement it provides, others may experience gambling as an addictive and distractive habit. '
                // }, {
                //     date: '12:11:48',
                //     typeName: 'Другое',
                //     message: 'While most people enjoy casino gambling, sports betting, lottery and bingo playing for the fun and excitement it provides, others may experience gambling as an addictive and distractive habit. '
                // }, {
                //     date: '12:11:48',
                //     typeName: 'Другое',
                //     message: 'While most people enjoy casino gambling, sports betting, lottery and bingo playing for the fun and excitement it provides, others may experience gambling as an addictive and distractive habit. '
                // }],
                // rightInfo: [
                //     {name: 'Сервер UPoint', icon: 'server.svg', iconErr: 'serverErr.svg', title: 'Доступен', status: true},
                //     {name: 'Баланс Jelastic', icon: 'balance.svg', iconErr: 'balanceErr.svg', title: '1 102.33',mdi: 'mdi-currency-rub', status: false},
                //     {name: 'Пользователи UPoint', icon: 'users.svg', iconErr: '', title: '999 999 999'},
                //     {name: 'Пользователи ONLINE', icon: 'online.svg', iconErr: 'onlineErr.svg',  title: '888 777 666', status: true},
                // ],
                // rightActions:[
                //     {icon: 'lamp_off.svg', iconActive:'lamp _on.svg', title: 'Линия 1'},
                //     {icon: 'lamp_off.svg', iconActive:'lamp _on.svg', title: 'Линия 2'},
                //     {icon: 'lamp_off.svg', iconActive:'lamp _on.svg', title: 'Кухня'},
                //     {icon: 'lamp_off.svg', iconActive:'lamp _on.svg', title: 'Этаж 2'},
                //     {icon: '', iconActive:'', title: ''},
                //     {icon: '', iconActive:'', title: ''},
                //     {icon: '', iconActive:'', title: ''},
                //     {icon: '', iconActive:'', title: ''},
                // ]
            }
        },
        created(){
            this.dateTime();

            this.socket = require('socket.io-client')('http://soback.jelastic.regruhosting.ru?device=client&token=27122712')

            this.socket.on('connect', function(){
                console.log('connected')
            });

            this.socket.on('reconnecting', function(data){
                console.log('reconnect', data)
            });
            this.socket.on('disconnect', function(){
                console.log('diconnect')
            });

            this.socket.on('clientInit', ({actions, widgets, info, indicators}) => {
                console.log(widgets);

                this.setInfo(info);
                this.setIndicators(indicators);
                this.setWidgets(widgets);
                this.setActions(actions)
            });

            this.socket.on('message', (message) => {
                this.messages.unshift(message)
            });

            this.socket.on('updateIndicators', (data) => {
                console.log(data);
                this.setIndicators(data)
            })
        },
        methods: {
            dateTime(){
                setInterval(() => {
                    this.time = moment().format('hh:mm:ss');
                    this.date = moment().format('DD.MM.YYYY');
                }, 100);
            },

            pressAction(key){
                if(key){
                    this.socket.emit('actions', key)
                }
            },

            setInfo(data){
                this.info = data;
            },

            setIndicators(list){
                let indicators = [];

                for(let i in list){
                    indicators.push(list[i]);
                }

                if(indicators.length < 8){
                    for(let i = indicators.length; i < 8; i++){
                        indicators.push({
                            title: null
                        });
                    }
                }

                this.indicators = indicators;
            },

            setWidgets(list){
                let widgets = [];

                for(let i in list){
                    widgets.push(list[i]);
                }

                this.widgets = widgets;
            },

            setActions(list){
                let actions = [];

                for(let i = 0; i <= 14; i++){
                    let index = list.findIndex(item => item.cell === i);

                    let obj = {};

                    if(index >= 0){
                        obj = {
                            textUp: list[index].textUp,
                            textDown: list[index].textDown,
                            icon: list[index].icon,
                            namespace: list[index].namespace,
                        }
                    }else{
                        obj = {
                            textUp: null,
                            textDown: null,
                            icon: null,
                            namespace: null,
                        }
                    }

                    actions.push(obj);
                    this.actions = actions;
                }
            }
        },
    }
</script>

<style lang="scss">
.el-table__body-wrapper{
    background-color: #272727;
}
</style>