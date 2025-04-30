package com.example.employeeService.entity;

import java.time.*;

public class OverlapWindow {
    private ZonedDateTime overlapStart;
    private ZonedDateTime overlapEnd;


    public OverlapWindow(ZonedDateTime overlapStart, ZonedDateTime overlapEnd) {
        this.overlapStart = overlapStart;
        this.overlapEnd = overlapEnd;

    }

    public ZonedDateTime getOverlapStart() {
        return overlapStart;
    }

    public ZonedDateTime getOverlapEnd() {
        return overlapEnd;
    }


}

