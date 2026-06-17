package com.qianxing.zhidao.trip.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.trip.entity.*;
import com.qianxing.zhidao.trip.mapper.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripService {

    private final QxUserTripMapper tripMapper;
    private final QxUserTripDayMapper tripDayMapper;
    private final QxUserTripSpotMapper tripSpotMapper;
    private final QxTripSafetyItemMapper safetyItemMapper;
    private final QxTripReviewMapper reviewMapper;

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
