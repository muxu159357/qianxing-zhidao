package com.qianxing.zhidao.trip.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.trip.entity.*;
import com.qianxing.zhidao.trip.service.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "trip", description = "用户行程接口")
@RestController
@RequestMapping("/api/app/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    private Long uid(HttpServletRequest req) { return (Long) req.getAttribute("userId"); }

    @Operation(summary = "行程列表")
    @GetMapping
    public ApiResponse<List<QxUserTrip>> listTrips(
            @RequestParam(required = false) String status, HttpServletRequest req) {
        return ApiResponse.ok(tripService.listTrips(uid(req), status));
    }

    @Operation(summary = "行程详情")
    @GetMapping("/{id}")
    public ApiResponse<QxUserTrip> getTrip(@PathVariable Long id, HttpServletRequest req) {
        return ApiResponse.ok(tripService.getTrip(id, uid(req)));
    }

    @Operation(summary = "保存行程")
    @PostMapping
    public ApiResponse<QxUserTrip> createTrip(@Valid @RequestBody QxUserTrip trip, HttpServletRequest req) {
        trip.setUserId(uid(req));
        return ApiResponse.ok(tripService.createTrip(trip));
    }

    @Operation(summary = "更新行程")
    @PutMapping("/{id}")
    public ApiResponse<QxUserTrip> updateTrip(@PathVariable Long id, @RequestBody QxUserTrip patch, HttpServletRequest req) {
        return ApiResponse.ok(tripService.updateTrip(id, uid(req), patch));
    }

    @Operation(summary = "删除行程")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTrip(@PathVariable Long id, HttpServletRequest req) {
        tripService.deleteTrip(id, uid(req));
        return ApiResponse.ok();
    }

    @Operation(summary = "每日安排")
    @GetMapping("/{id}/days")
    public ApiResponse<List<QxUserTripDay>> getDays(@PathVariable Long id, HttpServletRequest req) {
        return ApiResponse.ok(tripService.getTripDays(id, uid(req)));
    }

    @Operation(summary = "编辑每日安排")
    @PutMapping("/{id}/days/{dayId}")
    public ApiResponse<QxUserTripDay> updateDay(@PathVariable Long id, @PathVariable Long dayId,
                                                 @RequestBody QxUserTripDay patch, HttpServletRequest req) {
        return ApiResponse.ok(tripService.updateTripDay(id, dayId, uid(req), patch));
    }

    @Operation(summary = "安全清单")
    @GetMapping("/{id}/safety-items")
    public ApiResponse<List<QxTripSafetyItem>> getSafetyItems(@PathVariable Long id, HttpServletRequest req) {
        return ApiResponse.ok(tripService.getSafetyItems(id, uid(req)));
    }

    @Operation(summary = "勾选安全项")
    @PutMapping("/{id}/safety-items/{itemId}")
    public ApiResponse<QxTripSafetyItem> updateSafetyItem(@PathVariable Long id, @PathVariable Long itemId,
                                                           @RequestBody QxTripSafetyItem patch, HttpServletRequest req) {
        return ApiResponse.ok(tripService.updateSafetyItem(id, itemId, uid(req), patch));
    }

    @Operation(summary = "行程复盘")
    @PutMapping("/{id}/review")
    public ApiResponse<QxTripReview> saveReview(@PathVariable Long id, @RequestBody QxTripReview review, HttpServletRequest req) {
        return ApiResponse.ok(tripService.saveReview(id, uid(req), review));
    }
}
