package com.qianxing.zhidao.trip.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.trip.entity.*;
import com.qianxing.zhidao.trip.mapper.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class TripService {
    private static final Logger log = LoggerFactory.getLogger(TripService.class);

    private final QxUserTripMapper tripMapper;
    private final QxUserTripDayMapper tripDayMapper;
    private final QxUserTripSpotMapper tripSpotMapper;
    private final QxTripSafetyItemMapper safetyItemMapper;
    private final QxTripReviewMapper reviewMapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TripService(QxUserTripMapper tripMapper, QxUserTripDayMapper tripDayMapper,
                       QxUserTripSpotMapper tripSpotMapper, QxTripSafetyItemMapper safetyItemMapper,
                       QxTripReviewMapper reviewMapper) {
        this.tripMapper = tripMapper;
        this.tripDayMapper = tripDayMapper;
        this.tripSpotMapper = tripSpotMapper;
        this.safetyItemMapper = safetyItemMapper;
        this.reviewMapper = reviewMapper;
    }

    public List<QxUserTrip> listTrips(Long userId, String status) {
        LambdaQueryWrapper<QxUserTrip> qw = new LambdaQueryWrapper<>();
        qw.eq(QxUserTrip::getUserId, userId);
        if (status != null && !status.isBlank()) qw.eq(QxUserTrip::getStatus, status);
        qw.orderByDesc(QxUserTrip::getCreatedAt);
        return tripMapper.selectList(qw);
    }

    public QxUserTrip getTrip(Long id, Long userId) {
        QxUserTrip trip = tripMapper.selectById(id);
        if (trip == null || !trip.getUserId().equals(userId)) {
            throw new BusinessException(404, "行程不存在");
        }
        return trip;
    }

    @Transactional
    public QxUserTrip createTrip(QxUserTrip trip) {
        trip.setStatus(trip.getStatus() != null ? trip.getStatus() : "upcoming");
        tripMapper.insert(trip);

        // 从 planSnapshotJson 解析日计划并写入 qx_user_trip_day / qx_user_trip_spot
        String planJson = trip.getPlanSnapshotJson();
        if (planJson != null && !planJson.isBlank()) {
            try {
                Map<String, Object> plan = objectMapper.readValue(planJson, new TypeReference<>() {});
                List<Map<String, Object>> dayPlans = (List<Map<String, Object>>) plan.getOrDefault("dayPlans", List.of());
                List<String> spotNames = (List<String>) plan.getOrDefault("spotNames", List.of());
                for (int i = 0; i < dayPlans.size(); i++) {
                    Map<String, Object> dp = dayPlans.get(i);
                    QxUserTripDay day = new QxUserTripDay();
                    day.setTripId(trip.getId()); day.setDayNumber(i + 1);
                    day.setTitle((String) dp.getOrDefault("title", "第" + (i + 1) + "天"));
                    day.setDescription((String) dp.getOrDefault("description", ""));
                    day.setMeals((String) dp.getOrDefault("meals", ""));
                    day.setAccommodation((String) dp.getOrDefault("accommodation", ""));
                    tripDayMapper.insert(day);
                }
                for (int j = 0; j < spotNames.size(); j++) {
                    QxUserTripSpot spot = new QxUserTripSpot();
                    spot.setTripId(trip.getId()); spot.setSpotName(spotNames.get(j)); spot.setSpotOrder(j + 1);
                    tripSpotMapper.insert(spot);
                }
            } catch (Exception e) { log.warn("Failed to parse planSnapshotJson for trip {}: {}", trip.getId(), e.getMessage()); }
        }

        // 生成默认安全清单
        String[] items = {"提前查看景区开放时间", "准备好舒适的徒步鞋", "携带雨具和防晒用品",
                "检查手机电量和存储空间", "了解当地紧急联系电话", "合理安排每日体力"};
        for (int k = 0; k < items.length; k++) {
            QxTripSafetyItem si = new QxTripSafetyItem();
            si.setTripId(trip.getId()); si.setItemText(items[k]); si.setSortOrder(k + 1); si.setIsChecked(0);
            safetyItemMapper.insert(si);
        }
        return trip;
    }

    @Transactional
    public QxUserTrip updateTrip(Long id, Long userId, QxUserTrip patch) {
        QxUserTrip trip = getTrip(id, userId);
        if (patch.getRouteName() != null) trip.setRouteName(patch.getRouteName());
        if (patch.getCustomName() != null) trip.setCustomName(patch.getCustomName());
        if (patch.getStatus() != null) trip.setStatus(patch.getStatus());
        if (patch.getTravelStartDate() != null) trip.setTravelStartDate(patch.getTravelStartDate());
        if (patch.getTravelEndDate() != null) trip.setTravelEndDate(patch.getTravelEndDate());
        if (patch.getRouteSnapshotJson() != null) trip.setRouteSnapshotJson(patch.getRouteSnapshotJson());
        if (patch.getPlanSnapshotJson() != null) trip.setPlanSnapshotJson(patch.getPlanSnapshotJson());
        if (patch.getStartedAt() != null) trip.setStartedAt(patch.getStartedAt());
        if (patch.getCompletedAt() != null) trip.setCompletedAt(patch.getCompletedAt());
        tripMapper.updateById(trip);
        return trip;
    }

    @Transactional
    public void deleteTrip(Long id, Long userId) {
        QxUserTrip trip = getTrip(id, userId);
        tripMapper.deleteById(trip.getId());
    }

    public List<QxUserTripDay> getTripDays(Long tripId, Long userId) {
        getTrip(tripId, userId);
        return tripDayMapper.selectList(
                new LambdaQueryWrapper<QxUserTripDay>()
                        .eq(QxUserTripDay::getTripId, tripId)
                        .orderByAsc(QxUserTripDay::getDayNumber));
    }

    @Transactional
    public QxUserTripDay updateTripDay(Long tripId, Long dayId, Long userId, QxUserTripDay patch) {
        getTrip(tripId, userId);
        QxUserTripDay day = tripDayMapper.selectById(dayId);
        if (day == null || !day.getTripId().equals(tripId)) throw new BusinessException(404, "行程日不存在");
        if (patch.getTitle() != null) day.setTitle(patch.getTitle());
        if (patch.getDescription() != null) day.setDescription(patch.getDescription());
        if (patch.getMeals() != null) day.setMeals(patch.getMeals());
        if (patch.getAccommodation() != null) day.setAccommodation(patch.getAccommodation());
        day.setIsEdited(1);
        tripDayMapper.updateById(day);
        return day;
    }

    public List<QxTripSafetyItem> getSafetyItems(Long tripId, Long userId) {
        getTrip(tripId, userId);
        return safetyItemMapper.selectList(
                new LambdaQueryWrapper<QxTripSafetyItem>()
                        .eq(QxTripSafetyItem::getTripId, tripId)
                        .orderByAsc(QxTripSafetyItem::getSortOrder));
    }

    @Transactional
    public QxTripSafetyItem updateSafetyItem(Long tripId, Long itemId, Long userId, QxTripSafetyItem patch) {
        getTrip(tripId, userId);
        QxTripSafetyItem item = safetyItemMapper.selectById(itemId);
        if (item == null || !item.getTripId().equals(tripId)) throw new BusinessException(404, "安全项不存在");
        if (patch.getIsChecked() != null) item.setIsChecked(patch.getIsChecked());
        safetyItemMapper.updateById(item);
        return item;
    }

    public QxTripReview getReview(Long tripId, Long userId) {
        getTrip(tripId, userId);
        return reviewMapper.selectOne(
                new LambdaQueryWrapper<QxTripReview>().eq(QxTripReview::getTripId, tripId));
    }

    @Transactional
    public QxTripReview saveReview(Long tripId, Long userId, QxTripReview review) {
        getTrip(tripId, userId);
        QxTripReview existing = reviewMapper.selectOne(
                new LambdaQueryWrapper<QxTripReview>().eq(QxTripReview::getTripId, tripId));
        if (existing != null) {
            existing.setRating(review.getRating());
            existing.setHighlights(review.getHighlights());
            existing.setRegrets(review.getRegrets());
            existing.setNextAdvice(review.getNextAdvice());
            reviewMapper.updateById(existing);
            return existing;
        } else {
            review.setTripId(tripId);
            reviewMapper.insert(review);
            return review;
        }
    }
}
