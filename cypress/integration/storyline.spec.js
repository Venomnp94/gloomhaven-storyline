import utilities from "../utilities";

describe('Storyline', () => {

    it('It loads the storyline', () => {
        cy.visit('/tracker');

        cy.get('#chapter1').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It switches between landscape and portrait', () => {
        cy.visit('/tracker');

        cy.get('.landscape').should(($node) => {
            expect($node.length).to.be.greaterThan(4);
        });

        cy.get('.portrait').should(($node) => {
            expect($node).to.have.length(0);
        });

        cy.viewport(500, 800);

        cy.get('.landscape').should(($node) => {
            expect($node).to.have.length(0);
        });

        cy.get('.portrait').should(($node) => {
            expect($node.length).to.be.greaterThan(4);
        });
    });

    it('It can complete a scenario', () => {
        cy.visit('/tracker');
        utilities.isNodeVisible(1);
        utilities.isNodeHidden(2);

        utilities.completeScenario(1);
        utilities.isNodeVisible(2);
    });

    it('It can incomplete a scenario', () => {
        cy.visit('/tracker');
        utilities.completeScenario(1);

        utilities.isNodeVisible(2);

        utilities.incompleteScenario(1);

        utilities.isNodeHidden(2);
    });

    it('It reveals chapters', () => {
        let alerted = false;
        cy.on('window:alert', message => alerted = message);

        cy.visit('/tracker?states=1_c-2_c');

        cy.window().then((window) => {
            expect(alerted.includes('deprecated')).to.be.true;
        });

        cy.get('#chapter1').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });

        cy.get('#chapter2').should(($chapter) => {
            expect($chapter).css('display', 'none');
        });

        utilities.completeScenario(3);

        cy.get('#chapter1, #chapter2').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It blocks blocked scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-8_c');

        utilities.isNodeBlocked(9);
        utilities.openScenario(9);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });
        utilities.closeModel();
    });

    it('It blocks required scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-8_c');

        utilities.isNodeRequired(7);
        utilities.openScenario(7);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });
        utilities.closeModel();
    });

    it('It unlocks required scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-8_c');

        utilities.isNodeRequired(7);

        utilities.completeScenario(14);

        utilities.isNodeVisible(7);
        cy.get('#node7 .required').should(($radio) => {
            expect($radio).css('display', 'none');
        });

        utilities.openScenario(7);
        cy.get('#complete')
            .should('not.have.attr', 'disabled');
        utilities.closeModel();
    });

    it('It can share side scenarios', () => {
        cy.visit('/tracker');

        cy.get('#node52.opacity-50').should(($node) => {
            expect($node).to.have.length(1);
        });

        cy.visit('/tracker?states=52_i');

        utilities.isNodeVisible(52);
        cy.get('#node52.opacity-50').should(($node) => {
            expect($node).to.have.length(0);
        });
    });

    it('It can open a scenario via url', () => {
        cy.visit('/tracker/#/story/1');

        cy.get('#scenario-title').contains('#1 Black Barrow');
    });

    it('It shows summaries', () => {
        cy.visit('/tracker');

        utilities.openScenario(1);

        cy.get('#scenario-content').contains('Preceding events');
        cy.get('#scenario-content label').contains('Complete').click();
        cy.get('#scenario-content').contains('Summary').click();
        cy.get('#scenario-content').contains('Jekserah');

        utilities.closeModel();
    });

    it('It opens FC', () => {
        cy.visit('/tracker');

        utilities.switchGame('fc');

        cy.get('#chapter20').contains('Diviner');
        utilities.isNodeIncomplete(96);
        utilities.completeScenario(96);
        utilities.isNodeComplete(96);
        utilities.isNodeIncomplete(97);
    });

    it('It opens JotL', () => {
        cy.visit('/tracker');

        utilities.switchGame('jotl');

        cy.get('#chapter4').contains('Characters');
        utilities.isNodeIncomplete(1);
        utilities.completeScenario(1);
        utilities.isNodeComplete(1);
        utilities.isNodeIncomplete(2);
    });

    it('Storyline renders correclty', () => {
        cy.visit('/tracker#/shared/1/local/N4Rohg5gwgSgRALlGAzgbTgcVgWTgXQF8AacCAQRgBVFl0tK5iGomH5nNzXPHef2bLgK4cWQvuN5jhEmdzkSRk2dKWL+BEiBQBGWjoAuIAMalDGAOxbSYAAoAxAMoGwAdxC7SJgPZeQADYgAAzaKABMBijGJmEAzFEx5hgAbACsNuB2AFJ2rh7+vv5BoaQoACyJpslwcQAcbOUpmSgZSEbVIBZwlczhDURlze3Rnd1pwZn2ACIAQvme3n6kJWHWIzFhDRtjGGn6g+CYVDgOC4XLgSFhAJxVAEZhupM7Zl0Yugfa9uTTAKLnJbFa5lXQJdomAAWujSZSS7zgzxaukqrxq4WahzAxzsAPa7kWpkuq1BbVAo1ioOG5Ph3S+oPWNN2cEs9J0um2TLe3RSCUOejuaIRumsWLsTlY+IKQJWIJ04ReXLC4X0QrpGSxxxgADlAUTgaV5ZE1RgVVNZFLCUVZYbsYxLcElo6rrpleCuTU4ndmJZIpryDRLRdYVdnQBbMBy+xUeBBmWh5Woj0IyyTMVUABqkuQ0v1NuVZJAAAcTHAACYAJ0gPgAdlBIT4AJYmACm+jhzLSA2+dio02z4Fz1oTZQxVW5qUxPYcA4JFwNysZHUp8s5y89fp75AAknrhyT5YLk91ymzsVQ-tM98S5Sg4orlz2qE4M9eF2U4qrj6k7vy4salQ-d1i1LStqzrBtmzbJhH1sXsM0DHMrRvW1e2mRDB2Q98dDiJMOnudE+XiQtRkeD9qXw+IlwpGpyl-J8qAwud4wPO81xohFwnouCYHIN98w-I91xTIi4IDK84zzEcdHKB8OJPUVvi4KgAMw+cBJkr9hO6cJKk1TMzkk-db3KVTSLCcpgPkjA4g1JSAHV5iMlCLLwikLIo6yem7WxMD+AB5Wchx8OINIqajaQ+BpmDSRTfICqBVOYqTWPKdjIrgFI9KUhLgOS4zDVaLSvLSKd4v8zB+Ok1ozM2Mo0isuqdDSNymtaCLmQSPpN3q9LTDCFJiralJas7bidF5ccal0HqJta5lxpQdJxwGzyMt0ZpmDiMqjgDPLguwpaOonRFsqGPqTriUSJqE9yylTKaER2lBWRW+7RpXF7Gv6+75pOhUWksNbmUsOz7uOtYLq2IbmRSHydDqVSS3CDsTpGlo6m+z66j+2jZpQG4-oY3VnMOm4SKa89pj40mws+KpIRqMGdEhUAoTAYA4BeRZEUQHnjR58EedRHm2h54YefWHnth5wUeaRBB5dVeWBa8REhbVlE+c1sXNYlzWpddZgTEbQwAE9aG0MsRudRsy055W1d1ra5bV09teYNKPbgNJVZi13mBSfWfW5tWblD5gbgDxEFaVv3EXCeOwQj9Wk6u72YQ15gYRFnXncRWKM67Ivo42x3s8mxW1e1MASc8bQi0bQbSArGFmArHwwDLS3SAAV05lPy7geOs56b3DcIJ8qpKUgI3ruCAAknDxJD1NDWfIyNrJZic1eWJCDf592qg8PylzfIDQsz7J4GTpuNkUDqW71q6npX-COKsicWM95Sg+QDnlvR+fVIQ9nsi4B0TobSH1tNgGAeBabVTqB1UBcEqDigWM6XwzoZ4AMjIVOowNUE6BuN9YhPwcBMQ8FgnwOD-5z0KvfN6JDRqNh7P2ae9DN5KUYnkRBrEbgQzKDcNcUJETBBRs8LqIF-BeUsItKOBgxHPHKMQZ4GRSDI1RjUcmyJggPhLLIjKQM2B1GZnoYIMM77XWxAAaW3Hw3+vhVHSXsEFLCdMJGPW6JYawzBCF6KxjUOoZ5MD2LsElA6njcYImQXoimzJMamPhnYhx+0PHVWeEQp4wQUFKXCafKJmTghrhLKFWC7JgjP0SZMSOZ12QKzZtCFE2jYn1PsJgCSTjz5ZH+JwwqnwtKGNad0RGUw7AL0cWpfeAytavC3F06Zf9ZlYyUnYGm3SUauMwOsyJGTWKfASXfHa2InBUP2becOVQ2FlDqHJYwNzmrVM+ike5IBHmtASWwwgQA');
        const expectedData = JSON.parse('{"achievementgroup-CR":{"achievements":["GCRM"]},"achievementgroup-ART":{"achievements":["GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC"]},"scenario-1":{"state":"complete","treasures":["7"]},"achievement-PFS":{"awarded":true,"count":1,"lost":false},"scenario-2":{"state":"complete"},"scenario-3":{"state":"complete","treasures":["65"]},"achievement-PJP":{"awarded":true,"count":1,"lost":false},"scenario-4":{"state":"complete","treasures":["38","46"]},"scenario-5":{"state":"complete","treasures":["4","28"]},"scenario-6":{"state":"complete","treasures":["50"]},"achievement-PDB":{"awarded":true,"count":1,"lost":false},"scenario-7":{"state":"complete"},"scenario-8":{"state":"complete","treasures":["51"]},"achievement-GTMF":{"awarded":true,"count":1,"lost":false},"scenario-9":{"state":"blocked"},"scenario-10":{"state":"complete","treasures":["11"]},"achievement-PADE":{"awarded":true,"count":1,"lost":false},"scenario-13":{"choice":15,"state":"complete","treasures":["10"]},"scenario-14":{"state":"complete","treasures":["26"]},"achievement-GTPE":{"awarded":true,"count":1,"lost":false},"scenario-15":{"state":"complete"},"scenario-16":{"state":"complete","treasures":["1"]},"scenario-17":{"state":"complete","treasures":["71"]},"scenario-18":{"state":"complete","treasures":["63"]},"scenario-19":{"state":"complete","treasures":["17"]},"achievement-PSC":{"awarded":true,"count":1,"lost":false},"scenario-20":{"state":"complete"},"scenario-21":{"state":"complete","treasures":["15"]},"achievement-GTRN":{"awarded":true,"count":1,"lost":false},"scenario-22":{"state":"complete","treasures":["21"]},"achievement-GAC":{"awarded":true,"count":1,"lost":false},"achievement-GAR":{"awarded":false,"count":0,"lost":true},"scenario-23":{"state":"complete","treasures":["39","72"]},"achievement-GAT":{"awarded":true,"count":5,"lost":false,"manual_awarded":false},"achievement-PTR":{"awarded":true,"count":1,"lost":false},"scenario-24":{"state":"complete","treasures":["70"]},"achievement-PTVC":{"awarded":true,"count":1,"lost":false},"scenario-25":{"promptChoice":"dragonChoice1","state":"complete","treasures":["58"]},"achievement-PTDC":{"awarded":true,"count":1,"lost":false},"scenario-26":{"state":"complete","treasures":["66"]},"achievement-PFC":{"awarded":true,"count":1,"lost":false},"scenario-27":{"state":"complete"},"scenario-28":{"state":"complete","treasures":["32"]},"achievement-PAI":{"awarded":true,"count":1,"lost":false},"scenario-29":{"state":"complete","treasures":["41"]},"achievement-GTED":{"awarded":true,"count":1,"lost":false},"scenario-30":{"state":"complete"},"achievement-PTSV":{"awarded":true,"count":1,"lost":false},"scenario-31":{"state":"complete","treasures":["69"]},"scenario-32":{"state":"complete"},"scenario-33":{"promptChoice":"dragonChoice1","state":"complete"},"achievement-PTVT":{"awarded":true,"count":1,"lost":false},"achievement-PTDT":{"awarded":true,"count":1,"lost":false},"scenario-34":{"state":"blocked","treasures":["23"]},"scenario-35":{"state":"blocked"},"scenario-36":{"state":"blocked"},"scenario-37":{"state":"complete","treasures":["49"]},"achievement-PTTT":{"awarded":true,"count":1,"lost":false},"scenario-38":{"state":"complete","treasures":["29"]},"achievement-PRA":{"awarded":true,"count":1,"lost":false},"scenario-39":{"state":"complete","treasures":["73"]},"achievement-PATD":{"awarded":true,"count":1,"lost":false},"scenario-40":{"state":"complete","treasures":["47"]},"achievement-GAT2":{"awarded":true,"count":1,"lost":false},"scenario-41":{"state":"complete","treasures":["24"]},"achievement-GTVF":{"awarded":true,"count":1,"lost":false},"scenario-42":{"state":"blocked"},"scenario-43":{"state":"complete","treasures":["35"]},"achievement-GWB":{"awarded":true,"count":1,"lost":false},"scenario-44":{"state":"complete"},"scenario-46":{"state":"complete","treasures":["48"]},"achievement-GEOC":{"awarded":true,"count":3,"lost":false},"scenario-47":{"state":"complete","treasures":["18","57"]},"achievement-GEOC2":{"awarded":true,"count":1,"lost":false},"scenario-48":{"state":"complete","treasures":["64"]},"achievement-GEOC3":{"awarded":true,"count":1,"lost":false},"scenario-51":{"state":"complete","treasures":["56"]},"achievement-GEOG":{"awarded":true,"count":1,"lost":false},"scenario-52":{"state":"complete"},"scenario-53":{"state":"complete"},"scenario-54":{"state":"complete"},"scenario-57":{"state":"complete","treasures":["3","22"]},"scenario-58":{"state":"complete"},"scenario-61":{"state":"complete"},"scenario-62":{"state":"complete","treasures":["59"]},"scenario-63":{"state":"complete","treasures":["12"]},"scenario-64":{"state":"complete","treasures":["9"]},"scenario-65":{"state":"complete"},"scenario-66":{"state":"complete","treasures":["16","36"]},"achievement-GAT3":{"awarded":true,"count":1,"lost":false},"scenario-67":{"state":"complete","treasures":["14"]},"scenario-68":{"state":"complete","treasures":["33"]},"scenario-69":{"state":"complete"},"scenario-70":{"state":"complete","treasures":["6"]},"scenario-71":{"state":"complete"},"scenario-72":{"state":"complete"},"scenario-73":{"state":"complete"},"scenario-74":{"state":"complete","treasures":["20"]},"scenario-76":{"state":"complete","treasures":["75"]},"scenario-77":{"state":"complete"},"scenario-78":{"state":"complete"},"scenario-81":{"state":"complete","treasures":["68"]},"scenario-82":{"promptChoice":2,"state":"complete","treasures":["62"]},"scenario-83":{"state":"complete"},"scenario-84":{"state":"complete","treasures":["42"]},"scenario-94":{"state":"complete"},"achievement-PTTN":{"awarded":true,"count":1,"lost":false},"scenario-95":{"state":"complete"},"achievement-GTDA":{"awarded":true,"count":1,"lost":false},"scenario-11":{"state":"hidden","treasures":["5"]},"sheet":{"characters":{"0":true,"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true,"11":true,"12":true,"13":true,"14":true,"15":true,"16":true,"17":true},"city":{},"donations":620,"itemDesigns":{"1":true,"5":true,"39":true,"41":true,"48":true,"52":true,"59":true,"66":true,"70":true,"90":true,"99":true,"110":true,"112":true,"122":true,"130":true,"132":true,"133":true,"153":true,"154":true,"155":true,"157":true,"158":true,"159":true,"161":true,"163":true,"NaN":true},"prosperityIndex":61,"reputation":15,"road":{},"unlocks":{"0":true,"1":true,"2":true,"3":true,"4":true,"7":true}},"achievement-PT":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-PHSE":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-PBB":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-GAT4":{"awarded":true,"count":1,"lost":false},"achievement-GAT5":{"awarded":true,"count":1,"lost":false},"scenario-96":{"state":"complete","treasures":["91"]},"scenario-89":{"state":"complete","treasures":["13","43","27"]},"achievement-PSR":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"scenario-88":{"state":"hidden"},"achievement-PWS":{"awarded":false,"count":0,"lost":false,"manual_awarded":false},"achievement-GCRM":{"awarded":true,"count":1,"lost":false},"scenario-87":{"state":"hidden"},"achievement-PTPS":{"awarded":false,"count":0,"lost":false,"manual_awarded":false},"scenario-86":{"state":"hidden"},"scenario-93":{"state":"hidden"},"achievement-PAMT":{"awarded":false,"count":0,"lost":false,"manual_awarded":false},"scenario-91":{"state":"complete"},"scenario-92":{"state":"incomplete"},"achievement-PDC":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-GTTP":{"awarded":true,"count":1,"lost":false},"scenario-97":{"state":"complete"},"scenario-98":{"choice":"102,103","promptChoice":1,"state":"complete","treasures":["79"]},"scenario-99":{"choice":"104,105","promptChoice":2,"state":"complete","treasures":["95"]},"scenario-100":{"promptChoice":1,"state":"complete","treasures":["76","85"]},"scenario-101":{"state":"complete","treasures":["93"]},"achievement-GKIP":{"awarded":true,"count":4,"lost":false},"achievement-PC":{"awarded":true,"count":1,"lost":false},"scenario-102":{"state":"complete","treasures":["77","86"]},"scenario-103":{"state":"complete","treasures":["81"]},"achievement-GKIP2":{"awarded":true,"count":1,"lost":false},"scenario-104":{"state":"complete","treasures":["87"]},"scenario-105":{"state":"complete","treasures":["83","88"]},"achievement-GKIP3":{"awarded":true,"count":1,"lost":false},"scenario-106":{"state":"hidden"},"scenario-107":{"state":"hidden"},"achievement-GKIP4":{"awarded":true,"count":1,"lost":false},"scenario-108":{"promptChoice":3,"state":"complete"},"scenario-109":{"state":"complete","treasures":["80","94"]},"scenario-110":{"choice":114,"state":"complete","treasures":["84"]},"achievement-PGD":{"awarded":true,"count":1,"lost":false},"achievement-PDE":{"awarded":true,"count":1,"lost":false},"scenario-111":{"promptChoice":1,"state":"complete","treasures":["82"]},"achievement-PHP":{"awarded":true,"count":1,"lost":false},"scenario-114":{"state":"complete"},"achievement-PAD":{"awarded":true,"count":1,"lost":false},"scenario-113":{"state":"complete"},"achievement-GPA":{"awarded":true,"count":2,"lost":false},"achievement-GPA2":{"awarded":true,"count":1,"lost":false},"scenario-115":{"state":"complete","treasures":["96"]},"achievement-GST":{"awarded":true,"count":1,"lost":false},"scenario-90":{"state":"incomplete"},"scenario-80":{"state":"incomplete"},"scenario-59":{"state":"complete"},"scenario-60":{"state":"incomplete"},"scenario-55":{"state":"incomplete"}}');

        // check GH scenarios
        for (let id = 1; id <= 95; id++) {
            let data = expectedData['scenario-' + id];
            utilities.checkNodeState(id, data ? data.state : 'hidden');
        }

        utilities.switchGame('fc');

        // check FC scenarios
        for (let id = 96; id <= 115; id++) {
            let data = expectedData['scenario-' + id];
            utilities.checkNodeState(id, data ? data.state : 'hidden');
        }
    });

});
