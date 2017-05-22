Highcharts.chart('chartt', {

    title: {
        text: 'Query Purchase History'
    },

    yAxis: {
        title: {
            text: 'Cumulative price'
        }
    },

    tooltip:{
        formatter:function(){
            console.log(this);
            return 'select count(*) from crash';
        }
    },


    xAxis: {
        labels: {
            formatter: function() {
                return ('Q' + this.value );
            }
        }
    },



    series: [{
        name: 'History Aware',
        data: [0.89, 2.94, 2.94, 3.6, 4,12],
    },{
        name: 'History Oblivious',
        data: [0.89, 3.45, 5.57, 6.78, 11.78,25]
    }]

});