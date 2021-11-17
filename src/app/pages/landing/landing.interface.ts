export interface ILandingData {
    welcomeArea: {
      backgroundImage: string,
      title: string,
      subText: string,
      pdfLink: string,
    },
    verticalSocial: {facebookUrl: string, twitterUrl: string, discordUrl: string , pinterestUrl: string, youTubeUrl: string, telegramUrl: string},
    buyOrSellSection: {
      title: string,
      welcomeThumbImage: string,
      video: string,
      rightBlock: [{
          image: string,
          title: string,
          subtitle: string
      }]
    },
    investorSection: [{
          image: string,
          title: string,
          subtitle: string
    }],
    blogSection: [{
        mainLink: string;
        image: string; 
        title: string;
        date: string;
        author: string;
        body: string;
    }],
    servicesSection: [{
      image: string,
      title: string,
      subtitle: string
    }],
    roadmapSection: {
      image: string
    },
    deckSection: {
      decklink: string
    },
    tokenSection: {
      title: string,
      subtitle: string
      tokenAllocationData: [
        {name: string, value: number}
      ],
      useOfSalesData: [
        {name: string, value: number}
      ]
    }
  
  }