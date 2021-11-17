import { Component, OnInit} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { IMenuGroups } from 'src/app/core/components/footer/footer.interface';
import { INavButton } from 'src/app/core/components/header/header.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { ILandingData } from './landing.interface';
import {  NgForm } from '@angular/forms';

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  headerInfo: IMenuGroups = { "menuGroup": [{ "title": "", "menu": []}, { "title": "", "menu": []},{ "title": "", "menu": []}, { "title": "", "menu": []}], "logoPath": ""}
  navButtons: INavButton = { "create": {"title": "", "path": ""}, "wallet": { "title": "", "path": ""}};
  landingData: ILandingData;
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  walletAddress: string;
  country: string;
  linkedInUrl: string;
  tweetLink: string;

  chartInstance: any;
  tokenAllocation = {
    backgroundColor: 'transparent',
    title: {
      text: 'Token Allocation',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series: [
      {
        name: 'Token Allocation',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        roseType: 'radius',
        data: [
          { value: 40, name: '' },
          { value: 38, name: '' },
          { value: 32, name: '' },
          { value: 30, name: '' },
          { value: 28, name: '' },
          { value: 26, name: '' },
          { value: 22, name: '' },
          { value: 18, name: '' }
        ],
        label: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        },
        itemStyle: {
          color: '#c23531',
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };

  useOfSales = {
    backgroundColor: 'transparent',
    title: {
      text: 'Use Of Sales',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series: [
      {
        name: 'Use Of Sales',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        roseType: 'radius',
        data: [
          { value: 40, name: '' },
          { value: 38, name: '' },
          { value: 32, name: '' },
          { value: 30, name: '' },
          { value: 28, name: '' },
          { value: 26, name: '' },
          { value: 22, name: '' },
          { value: 18, name: '' }
        ],
        label: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        },
        itemStyle: {
          color: '#c23531',
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };

  constructor(public mainService: MainService, public metamaskService: MetamaskService, private spinner: NgxSpinnerService) {
   }

  ngOnInit(): void {
    this.spinner.show();
    this.mainService.getLanding().subscribe((res: any) => {
      this.landingData = res;
      this.landingData.tokenSection.tokenAllocationData.map((token) => {
        token.name = token.name + ' ' + '(' + token.value + '%' + ')';
        token.value = token.value * 10;
      })
      this.landingData.tokenSection.useOfSalesData.map((token) => {
        token.name = token.name + ' ' + '(' + token.value + '%' + ')';
        token.value = token.value * 10;
      })
      this.updateCharts();
    }) 
    this.mainService.getHeader().subscribe((res: any) => {
      this.headerInfo = res;
    })  
    this.mainService.getNavButtons().subscribe(res => {
      this.navButtons = res;
    });
    this.spinner.hide();
  }

  sendData(contactForm: NgForm) {
    this.mainService.submitWhitelistForm(
      contactForm.value.email, contactForm.value.firstName, contactForm.value.lastName,
      contactForm.value.amount, contactForm.value.walletAddress, contactForm.value.linkedInUrl,
      contactForm.value.country, contactForm.value.tweetLink
    ).subscribe(res => {
    });
  }

  updateCharts() {
    this.tokenAllocation = {
      backgroundColor: 'transparent',
      title: {
        text: 'Token Allocation',
        left: 'center',
        top: 20,
        textStyle: {
          color: 'black'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        show: false,
        min: 50,
        max: 1000,
        inRange: {
          colorLightness: [0, 2]
        }
      },
      series: [
        {
          name: 'Token Allocation',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          roseType: 'radius',
          data: this.landingData.tokenSection.tokenAllocationData.sort(function (a, b) {
            return a.value - b.value;
          }),
          label: {
            color: 'black'
          },
          labelLine: {
            lineStyle: {
              color: 'black'
            },
            smooth: 0.2,
            length: 5,
            length2: 10
          },
          itemStyle: {
            color: '#5892F5',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };
    this.useOfSales = {
      backgroundColor: 'transparent',
      title: {
        text: 'Use Of Sales',
        left: 'center',
        top: 20,
        textStyle: {
          color: 'black'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        show: false,
        min: 50,
        max: 1000,
        inRange: {
          colorLightness: [0, 2]
        }
      },
      series: [
        {
          name: 'Use Of Sales',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          roseType: 'radius',
          data: this.landingData.tokenSection.useOfSalesData.sort(function (a, b) {
            return a.value - b.value;
          }),
          label: {
            color: 'black'
          },
          labelLine: {
            lineStyle: {
              color: 'black'
            },
            smooth: 0.2,
            length: 5,
            length2: 10
          },
          itemStyle: {
            color: 'purple',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };
  }


}
