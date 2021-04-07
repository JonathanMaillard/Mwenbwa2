import * as React from "react";
import {Marker} from "react-leaflet";
import L from "leaflet";
import treesSvg from "../scripts/trees-svg";
import MyPopup from "./popup";

const treeBank = {
    winter: [
        "007-eucalyptus",
        "010-tree",
        "025-pine",
        "027-cypress",
        "036-tree_branch",
        "038-tree",
        "046-pine",
        "046-pine",
    ],
    spring: [
        "002-tree",
        "005-almond_tree",
        "011-tree",
        "012-cherry_tree",
        "013-tree",
        "016-sakura",
        "017-tree",
        "024-birch_tree",
        "026-banyan",
        "030-plant",
        "040-willow",
        "042-tree",
        "049-lemon_tree",
    ],
    summer: [
        "001-magnolia",
        "002-tree",
        "003-tree",
        "004-tree",
        "008-cocoa_tree",
        "011-tree",
        "013-tree",
        "014-tree",
        "018-tree",
        "019-tree",
        "020-bonsai",
        "024-birch_tree",
        "026-banyan",
        "029-tree",
        "030-plant",
        "032-tree",
        "037-baobab",
        "039-sequoia",
        "040-willow",
        "042-tree",
        "044-palm_tree",
        "045-olive",
        "049-lemon_tree",
    ],
    autumn: [
        "003-tree",
        "004-tree",
        "009-tree",
        "010-tree",
        "015-poplar",
        "022-tree",
        "025-pine",
        "027-cypress",
        "028-linden",
        "033-larch",
        "034-tree",
        "035-tree",
        "036-tree_branch",
        "039-sequoia",
        "041-maple",
        "043-tree",
        "050-tree",
    ],
};

const getRandomTree = month => {
    let season;
    switch (month) {
        case 11:
        case 0:
        case 1:
            season = "winter";
            break;
        case 2:
        case 3:
        case 4:
            season = "spring";
            break;
        case 5:
        case 6:
        case 7:
            season = "summer";
            break;
        case 8:
        case 9:
        case 10:
            season = "autumn";
            break;
        default:
            season = "summer";
    }
    const tree =
        treeBank[season][(Math.random() * treeBank[season].length) | 0];
    return tree;
};

const newTree = () => {
    const month = new Date().getMonth();
    const tree = treesSvg[getRandomTree(month)];
    const leafletIcon = L.icon({
        iconUrl: tree,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
    });
    return leafletIcon;
};

const MapMarker = ({position, tree}) => (
    <Marker position={position} icon={newTree()} key={tree}>
        <MyPopup treeId={tree} />
    </Marker>
);

export default MapMarker;
