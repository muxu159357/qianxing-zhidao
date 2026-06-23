package com.qianxing.zhidao.route.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.route.entity.QxRoute;
import com.qianxing.zhidao.route.entity.QxRouteDay;
import com.qianxing.zhidao.route.entity.QxRouteSpot;
import com.qianxing.zhidao.route.mapper.QxRouteDayMapper;
import com.qianxing.zhidao.route.mapper.QxRouteMapper;
import com.qianxing.zhidao.route.mapper.QxRouteSpotMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private final QxRouteMapper routeMapper;
    private final QxRouteDayMapper routeDayMapper;
    private final QxRouteSpotMapper routeSpotMapper;

    public RouteService(QxRouteMapper routeMapper, QxRouteDayMapper routeDayMapper, QxRouteSpotMapper routeSpotMapper) {
        this.routeMapper = routeMapper;
        this.routeDayMapper = routeDayMapper;
        this.routeSpotMapper = routeSpotMapper;
    }

    public PageResult<QxRoute> listRoutes(String energyLevel, String theme, String keyword, int page, int size) {
        LambdaQueryWrapper<QxRoute> qw = new LambdaQueryWrapper<>();
        qw.eq(QxRoute::getStatus, 1);
        if (energyLevel != null && !energyLevel.isBlank()) qw.eq(QxRoute::getEnergyLevel, energyLevel);
        if (theme != null && !theme.isBlank()) qw.eq(QxRoute::getTheme, theme);
        if (keyword != null && !keyword.isBlank()) qw.like(QxRoute::getName, keyword);
        qw.orderByAsc(QxRoute::getSortOrder);

        Page<QxRoute> mpPage = new Page<>(page, size);
        Page<QxRoute> result = routeMapper.selectPage(mpPage, qw);
        return PageResult.of(result.getRecords(), result.getTotal(), page, size);
    }

    public QxRoute getRoute(Long id) {
        QxRoute route = routeMapper.selectById(id);
        if (route == null || route.getStatus() != 1) {
            throw new BusinessException(404, "路线不存在");
        }
        return route;
    }
    public QxRoute adminGetRoute(Long id) {
        QxRoute route = routeMapper.selectById(id);
        if (route == null) throw new BusinessException(404, "路线不存在");
        return route;
    }

    public List<QxRouteDay> getRouteDays(Long routeId) {
        return routeDayMapper.selectList(
                new LambdaQueryWrapper<QxRouteDay>()
                        .eq(QxRouteDay::getRouteId, routeId)
                        .orderByAsc(QxRouteDay::getDayNumber));
    }

    public List<QxRouteSpot> getRouteSpots(Long routeId) {
        return routeSpotMapper.selectList(
                new LambdaQueryWrapper<QxRouteSpot>().eq(QxRouteSpot::getRouteId, routeId));
    }

    public List<QxRoute> recommend(int dayCount, String energyLevel, String budgetRange, int limit) {
        LambdaQueryWrapper<QxRoute> qw = new LambdaQueryWrapper<>();
        qw.eq(QxRoute::getStatus, 1);
        if (dayCount > 0) qw.le(QxRoute::getDayCount, dayCount + 1).ge(QxRoute::getDayCount, dayCount - 1);
        if (energyLevel != null && !energyLevel.isBlank()) qw.eq(QxRoute::getEnergyLevel, energyLevel);
        qw.orderByAsc(QxRoute::getSortOrder);
        qw.last("LIMIT " + Math.min(limit, 20));
        return routeMapper.selectList(qw);
    }

    public PageResult<QxRoute> adminList(String keyword, int page, int size) {
        LambdaQueryWrapper<QxRoute> qw = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isBlank()) qw.like(QxRoute::getName, keyword);
        qw.orderByAsc(QxRoute::getSortOrder);
        Page<QxRoute> mp = new Page<>(page, size);
        Page<QxRoute> r = routeMapper.selectPage(mp, qw);
        return PageResult.of(r.getRecords(), r.getTotal(), page, size);
    }
    public QxRoute createRoute(QxRoute r) { routeMapper.insert(r); return r; }
    public QxRoute updateRoute(Long id, QxRoute p) {
        QxRoute r = routeMapper.selectById(id);
        if (r == null) throw new BusinessException(404, "路线不存在");
        if (p.getName() != null) r.setName(p.getName());
        if (p.getDayCount() != null) r.setDayCount(p.getDayCount());
        if (p.getEnergyLevel() != null) r.setEnergyLevel(p.getEnergyLevel());
        if (p.getStatus() != null) r.setStatus(p.getStatus());
        routeMapper.updateById(r);
        return r;
    }
    public void deleteRoute(Long id) { routeMapper.deleteById(id); }
}
