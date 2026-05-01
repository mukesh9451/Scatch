import {expect, it,describe} from "vitest";
import { formateMoney } from "./money";

describe("formateMoney",()=>{
it("formats 1999 cents as $19.99",()=>{
    expect(formateMoney(1999)).toBe("$19.99");
    });

it("displays 2 decimal",()=>{
    expect(formateMoney(1090)).toBe("$10.90")
    expect(formateMoney(100)).toBe("$1.00")
})
})
