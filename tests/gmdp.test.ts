import { test, expect } from "@jest/globals";
import { Gmdp } from "../src/gmdp";

test("Bad url", () => {
    // const g = new Gmdp('https://www.google.co.uk/maps/@50.938273,-1.3534897,10.75z?hl=en');
    expect(() => {
        new Gmdp(
            "https://www.google.co.uk/maps/@50.938273,-1.3534897,10.75z?hl=en"
        );
    }).toThrow("no parsable data parameter found");
});
test("Basic route", () => {
    const g = new Gmdp(
        "https://www.google.co.uk/maps/dir/53.3544359,-2.1083514/Manchester+Town+Hall,+Manchester/Bolton,+UK/@53.5188983,-2.3993109,12z/data=!4m16!4m15!1m1!4e1!1m5!1m1!1s0x487bb1c18d758c47:0xefab6c7fe0032f62!2m2!1d-2.2445756!2d53.4792335!1m5!1m1!1s0x487b0629dc3b1c93:0xcaa40cfafe557822!2m2!1d-2.4282192!2d53.5768647!3e0?hl=en"
    );
    expect(g).toBeInstanceOf(Gmdp);
    expect(g.getMapType()).toBe("map");
    expect(g.getRoute()?.getTransportation()).toBe("car");
    expect(g.getRoute()?.getAllWaypoints()).toHaveLength(3);
    expect(g.getRoute()?.getUnit()).toBe(undefined); // no unit defined in params
});
test("Basic route (transit)", () => {
    const g = new Gmdp(
        "https://www.google.co.uk/maps/dir/53.3544359,-2.1083514/Bolton,+UK/@53.458306,-2.4075829,11z/data=!3m1!4b1!4m10!4m9!1m1!4e1!1m5!1m1!1s0x487b0629dc3b1c93:0xcaa40cfafe557822!2m2!1d-2.4282192!2d53.5768647!3e3?hl=en"
    );
    expect(g).toBeInstanceOf(Gmdp);
    expect(g.getMapType()).toBe("map");
    expect(g.getRoute()?.getTransportation()).toBe("transit");
    expect(g.getRoute()?.getAllWaypoints()).toHaveLength(2);
});
test("Basic route (bike)", () => {
    const g = new Gmdp(
        "https://www.google.co.uk/maps/dir/53.3544359,-2.1083514/Manchester+Town+Hall,+Manchester/Bolton,+UK/@53.465844,-2.4088932,11z/data=!3m1!4b1!4m16!4m15!1m1!4e1!1m5!1m1!1s0x487bb1c18d758c47:0xefab6c7fe0032f62!2m2!1d-2.2445756!2d53.4792335!1m5!1m1!1s0x487b0629dc3b1c93:0xcaa40cfafe557822!2m2!1d-2.4282192!2d53.5768647!3e1?hl=en"
    );
    expect(g).toBeInstanceOf(Gmdp);
    expect(g.getMapType()).toBe("map");
    expect(g.getRoute()?.getTransportation()).toBe("bike");
    expect(g.getRoute()?.getAllWaypoints()).toHaveLength(3);
});
test("Basic route (foot)", () => {
    const g = new Gmdp(
        "https://www.google.co.uk/maps/dir/53.3544359,-2.1083514/Manchester+Town+Hall,+Manchester/Bolton,+UK/@53.465844,-2.4087084,11z/data=!3m1!4b1!4m16!4m15!1m1!4e1!1m5!1m1!1s0x487bb1c18d758c47:0xefab6c7fe0032f62!2m2!1d-2.2445756!2d53.4792335!1m5!1m1!1s0x487b0629dc3b1c93:0xcaa40cfafe557822!2m2!1d-2.4282192!2d53.5768647!3e2?hl=en"
    );
    expect(g).toBeInstanceOf(Gmdp);
    expect(g.getMapType()).toBe("map");
    expect(g.getRoute()?.getTransportation()).toBe("foot");
    expect(g.getRoute()?.getAllWaypoints()).toHaveLength(3);
});
test("Route with secondary waypoints", () => {
    const g = new Gmdp(
        "https://www.google.co.uk/maps/dir/Stockport+Town+Hall,+Stockport/53.4792175,-1.644872/53.4132379,-1.8360711/Stockport+Town+Hall,+Stockport/@53.4346254,-2.1105324,10.25z/data=!4m26!4m25!1m10!1m1!1s0x487bb37cf3465a99:0x9a665518e24e66a5!2m2!1d-2.1584868!2d53.4060755!3m4!1m2!1d-2.0792622!2d53.4508176!3s0x487bb5dd7e9ecd2f:0x1f85a3230047b373!1m0!1m5!3m4!1m2!1d-2.0740076!2d53.3962551!3s0x487bb56ae9752e19:0xca4165d9cbdd4a1c!1m5!1m1!1s0x487bb37cf3465a99:0x9a665518e24e66a5!2m2!1d-2.1584868!2d53.4060755!3e1?hl=en"
    );
    expect(g).toBeInstanceOf(Gmdp);
    expect(g.getRoute()?.getAllWaypoints()).toHaveLength(6);
});
test("Streetview", () => {
    const g = new Gmdp(
        "https://www.google.co.uk/maps/@51.6886014,5.3101255,3a,75y,86.06h,90t/data=!3m7!1e1!3m5!1sYJm3ADIz89LrIM9SGlYE2w!2e0!6s%2F%2Fgeo1.ggpht.com%2Fcbk%3Fpanoid%3DYJm3ADIz89LrIM9SGlYE2w%26output%3Dthumbnail%26cb_client%3Dmaps_sv.tactile.gps%26thumb%3D2%26w%3D203%26h%3D100%26yaw%3D303.07285%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656?hl=en"
    );
    expect(g).toBeInstanceOf(Gmdp);
    expect(g.getMapType()).toBe("streetview");
});
test("Local search (mv:)", () => {
    const g = new Gmdp(
        "https://www.google.co.uk/search?client=ubuntu&espv=2&biw=1194&bih=852&q=gloucester+historic&npsic=0&rflfq=1&rlha=0&rllag=51863865,-2250128,124&tbm=lcl&ved=0ahUKEwiavNXPr-HSAhVLJcAKHfllCoMQtgMIHA&tbs=lf_msr:-1,lf_od:-1,lf_oh:-1,lf_pqs:EAE,lf:1,lf_ui:1&rldoc=1#rlfi=hd:;si:;mv:!1m3!1d18143.39399274318!2d-2.250704480395484!3d51.868243325313784!3m2!1i774!2i707!4f13.1;tbs:lf_msr:-1,lf_od:-1,lf_oh:-1,lf_pqs:EAE,lf:1,lf_ui:1"
    );
    expect(g).toBeInstanceOf(Gmdp);
});
test("Pin", () => {
    const g = new Gmdp(
        "https://www.google.co.uk/maps/place/V%C3%A4ster%C3%A5s,+Sweden/@59.3033626,15.0198179,10.5z/data=!4m5!3m4!1s0x465e4281455ba9a7:0xbc415db6e2654020!8m2!3d59.6099005!4d16.5448091?hl=en"
    );
    expect(g).toBeInstanceOf(Gmdp);
    expect(g.pins).toHaveLength(1);
    expect(g.pins[0].lat).toBe(59.6099005);
    expect(g.pins[0].lng).toBe(16.5448091);
});
test("Transit, last available with prefs", () => {
    const g = new Gmdp(
        "https://www.google.co.uk/maps/dir/Versailles,+France/Cr%25C3%25A9teil,+France/@48.8053495,2.1524205,11z/data=!3m1!4b1!4m20!4m19!1m5!1m1!1s0x47e67db475f420bd:0x869e00ad0d844aba!2m2!1d2.130122!2d48.801408!1m5!1m1!1s0x47e60caf330272df:0x4573b9315445d467!2m2!1d2.455572!2d48.790367!2m4!4e2!5e0!5e3!6e2!3e3!4e1"
    );
    expect(g).toBeInstanceOf(Gmdp);
    expect(g.getRoute()?.getTransitModePref()).toHaveLength(2);
    expect(g.getRoute()?.getRoutePref()).toBe("fewer transfers");
    expect(g.getRoute()?.getUnit()).toBe("miles");
    expect(g.getRoute()?.getArrDepTimeType()).toBe("last available");
});
